import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "./encoder";

export class Latin1Encoder implements Encoder {
    #encoder;
    constructor() {
        this.#encoder = new TextEncoder();
    }

    // TextDecoder does not support latin1 (ISO-8859-1)
    // String.fromCharCode will generate the correct character
    // in latin1 range, and our bytes are only 0-255 so we iterate
    // over the bytes and convert one-by-one.
    encode(ct: Ciphertext): string {
        let result = "";
        ct.bytes.forEach(byte => {
            result += String.fromCharCode(byte);
        })

        return result;
    }

    decode(s: string) : Uint8Array {
        return this.#encoder.encode(s)
    }
}