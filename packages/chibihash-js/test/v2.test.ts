import {chibihash64_v2} from '../src';

describe('chibihash64_v2', () => {
  test.each([
    ['', 55555n, 0x58aee94ca9fb5092n],
    ['', 0n, 0xd4f69e3eccf128fcn],
    ['hi', 0n, 0x92c85ca994367dacn],
    ['123', 0n, 0x788a224711ff6e25n],
    ['abcdefgh', 0n, 0xa2e39be0a0689b32n],
    ['Hello, world!', 0n, 0xabf8eb3100b2fec7n],
    ['qwertyuiopasdfghjklzxcvbnm123456', 0n, 0x90fc5db7f56967fan],
    ['qwertyuiopasdfghjklzxcvbnm123456789', 0n, 0x6dcdce02882a4975n],
  ])('chibihash64_v2("%s", %d) = %d', (message, seed, expected) => {
    expect(chibihash64_v2(message, seed)).toEqual(expected);
  });
});
