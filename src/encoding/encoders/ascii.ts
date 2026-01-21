import { Ciphertext, Encoding } from "ctes-models-ts";
import { EncodingFailedError } from "../../exceptions";
import { Encoder } from "../encoder";

export class AsciiEncoder implements Encoder {
    #encoder;
    #decoder;
    constructor() {
        this.#encoder = new TextEncoder();
        this.#decoder = new TextDecoder('ascii');

    }

    encode(ct: Ciphertext): string {
        if (ct.bytes.some(byte => byte > 127)) {
            throw new EncodingFailedError("One or more bytes in the byte stream contained a value over 127.");
        }
        return this.#decoder.decode(ct.bytes);
    }

    decode(s: string) : Ciphertext {
        return {
            bytes: this.#encoder.encode(s),
            metadata: {
                type: "text",
                encoding: { encoding: Encoding.ASCII, base: 0 }
            }
        };
    }
}