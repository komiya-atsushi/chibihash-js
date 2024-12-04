const K = 0x2b7e151628aed2a7n;
const KmulKxorK = (K * K) ^ K;

function rotl(x: bigint, n: bigint): bigint {
  return BigInt.asUintN(64, x << n) | (x >> (64n - n));
}

const textEncoder = new TextEncoder();
const utf8BufferSize = 2048;
const stringLengthThresholdToUseBuffer = utf8BufferSize / 3;
const utf8Buffer = new Uint8Array(utf8BufferSize);

function toDataView(message: string | Uint8Array | DataView): DataView {
  if (typeof message === 'string') {
    if (message.length <= stringLengthThresholdToUseBuffer) {
      const {written} = textEncoder.encodeInto(message, utf8Buffer);
      return new DataView(utf8Buffer.buffer, 0, written);
    }

    const utf8bytes = textEncoder.encode(message);
    return new DataView(
      utf8bytes.buffer,
      utf8bytes.byteOffset,
      utf8bytes.byteLength,
    );
  }

  if (message instanceof Uint8Array) {
    return new DataView(message.buffer, message.byteOffset, message.byteLength);
  }

  return message;
}

export function chibihash64_v2(
  _key: string | Uint8Array | DataView,
  seed: bigint,
): bigint {
  if (!(seed >= 0n && seed <= 0xffff_ffff_ffff_ffffn)) {
    throw new Error('seed must be a 64-bit unsigned bigint value');
  }

  const key = toDataView(_key);
  let p = 0;
  const len = key.byteLength;
  let l = len;

  const t = BigInt.asUintN(64, seed - K);
  const seed2 = BigInt.asUintN(64, rotl(t, 15n) + rotl(t, 47n));
  const h = [
    seed,
    BigInt.asUintN(64, seed + K),
    seed2,
    BigInt.asUintN(64, seed2 + KmulKxorK),
  ];

  for (; l >= 32; l -= 32) {
    for (let i = 0; i < 4; ++i, p += 8) {
      const stripe = key.getBigUint64(p, true);

      h[i] = BigInt.asUintN(64, (stripe + h[i]) * K);
      h[(i + 1) & 3] += rotl(stripe, 27n);
    }
  }

  for (; l >= 8; l -= 8, p += 8) {
    h[0] ^= BigInt(key.getUint32(p, true));
    h[0] = BigInt.asUintN(64, h[0] * K);
    h[1] ^= BigInt(key.getUint32(p + 4, true));
    h[1] = BigInt.asUintN(64, h[1] * K);
  }

  if (l >= 4) {
    h[2] ^= BigInt(key.getUint32(p, true));
    h[3] ^= BigInt(key.getUint32(p + l - 4, true));
  } else if (l > 0) {
    h[2] ^= BigInt(key.getUint8(p));
    h[3] ^= BigInt(key.getUint8(p + l / 2) | (key.getUint8(p + l - 1) << 8));
  }

  h[0] = BigInt.asUintN(
    64,
    h[0] + (rotl(BigInt.asUintN(64, h[2] * K), 31n) ^ (h[2] >> 31n)),
  );
  h[1] = BigInt.asUintN(
    64,
    h[1] + (rotl(BigInt.asUintN(64, h[3] * K), 31n) ^ (h[3] >> 31n)),
  );
  h[0] = BigInt.asUintN(64, h[0] * K);
  h[0] ^= h[0] >> 31n;
  h[1] = BigInt.asUintN(64, h[1] + h[0]);

  let x = BigInt.asUintN(64, BigInt(len) * K);
  x ^= rotl(x, 29n);
  x = BigInt.asUintN(64, x + seed);
  x ^= h[1];

  x ^= rotl(x, 15n) ^ rotl(x, 42n);
  x = BigInt.asUintN(64, x * K);
  x ^= rotl(x, 13n) ^ rotl(x, 31n);

  return x;
}
