import { Ciphertext, Encoding } from "ctes-models-ts";
import { Encoder } from "../encoder";
import { encode as u8ToUtf16Encode, decode as utf16ToU8Decode } from "uint8-to-utf16";

// This encoder uses `uint8-to-utf16` to provide a *lossless* mapping between arbitrary bytes and a JS string.
// See: https://github.com/WebReflection/uint8-to-utf16
export class Utf16Encoder implements Encoder {
    constructor() {}

    encode(ct: Ciphertext): string {
        return u8ToUtf16Encode(ct.bytes);
    }

    decode(s: string): Ciphertext {
        return {
            bytes: utf16ToU8Decode(s),
            metadata: {
                type: "text",
                encoding: { encoding: Encoding.UTF16, base: 0 }
            }
        };
    }
}

