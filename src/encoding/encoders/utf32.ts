import { Ciphertext, Encoding } from "ctes-models-ts";
import { Encoder } from "../encoder";
import { EncodingFailedError } from "../../exceptions";


export class Utf32Encoder implements Encoder {
    constructor() {}

    encode(ct: Ciphertext): string {
        const bytes = ct.bytes;
        if (bytes.length % 4 !== 0) {
            throw new EncodingFailedError("Invalid UTF-32 byte stream length: must be a multiple of 4.");
        }

        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        let result = '';

        for (let i = 0; i < bytes.length; i += 4) {
            const cp = view.getUint32(i, true);
            // Reject out-of-range and surrogate code points (UTF-32 is Unicode scalar values).
            if (cp > 0x10FFFF || (cp >= 0xD800 && cp <= 0xDFFF)) {
                throw new EncodingFailedError(`Invalid UTF-32 code point: ${cp}.`);
            }
            result += String.fromCodePoint(cp);
        }

        return result;
    }

    decode(s: string): Ciphertext {
        // Convert a JS string (UTF-16) into UTF-32 code points, then serialize as UTF-32LE bytes.
        // `for...of` iterates Unicode code points (handles surrogate pairs correctly).
        const codePoints = Array.from(s, (ch) => ch.codePointAt(0)!);

        const bytes = new Uint8Array(codePoints.length * 4);
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        for (let i = 0; i < codePoints.length; i++) {
            const cp = codePoints[i];
            // UTF-32 is defined for Unicode scalar values 0..0x10FFFF; codePointAt() guarantees this.
            view.setUint32(i * 4, cp, true /* littleEndian */);
        }

        return {
            bytes,
            metadata: {
                type: "text",
                encoding: { encoding: Encoding.UTF32, base: 0 }
            }
        };
    }
}