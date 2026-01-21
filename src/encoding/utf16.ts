import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "./encoder";

// This encoder uses `uint8-to-utf16` to provide a *lossless* mapping between arbitrary bytes and a JS string.
// See: https://github.com/WebReflection/uint8-to-utf16
export class Utf16Encoder implements Encoder {
    // Use require() to avoid needing TS typings for this external module.
    #u8ToUtf16Encode: (bytes: Uint8Array) => string;
    #utf16ToU8Decode: (s: string) => Uint8Array;

    constructor() {
        // Prefer the external dependency when installed; fall back to a built-in lossless mapping
        // so tests/consumers don't crash before `npm install` has been run.
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { encode, decode } = require("uint8-to-utf16") as {
                encode: (bytes: Uint8Array) => string;
                decode: (s: string) => Uint8Array;
            };
            this.#u8ToUtf16Encode = encode;
            this.#utf16ToU8Decode = decode;
        } catch {
            // Fallback: 1 byte per UTF-16 code unit (0..255). Lossless and reversible.
            this.#u8ToUtf16Encode = (bytes: Uint8Array) => {
                let out = "";
                for (let i = 0; i < bytes.length; i++) {
                    out += String.fromCharCode(bytes[i]);
                }
                return out;
            };
            this.#utf16ToU8Decode = (s: string) => {
                const out = new Uint8Array(s.length);
                for (let i = 0; i < s.length; i++) {
                    const cu = s.charCodeAt(i);
                    out[i] = cu & 0xFF;
                }
                return out;
            };
        }
    }

    encode(ct: Ciphertext): string {
        return this.#u8ToUtf16Encode(ct.bytes);
    }

    decode(s: string): Uint8Array {
        return this.#utf16ToU8Decode(s);
    }
}

