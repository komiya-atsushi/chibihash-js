# chibihash-js

A TypeScript (JS) implementation of [N-R-K/ChibiHash](https://github.com/N-R-K/ChibiHash) v2.

## Installation

```bash
npm install chibihash-js
```

## Usage

```typescript
import {chibihash64 /* or chibihash64_v2 */} from 'chibihash-js';
import * as crypto from 'node:crypto';

// You need to specify a seed value.
console.log(chibihash64('Hello, world!', 0n)); // Output: 12391912970407575239n

// Seed must be a 64-bit unsigned bigint value.
const seed = crypto.randomBytes(8).readBigUInt64BE(0);
console.log(chibihash64('Hello, world!', seed));
```


## License

MIT License

Copyright (c) 2024 KOMIYA Atsushi.
