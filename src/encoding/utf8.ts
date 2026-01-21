import { Ciphertext, Encoding } from "ctes-models-ts";
import { EncodingFailedError } from "../exceptions";
import { Encoder } from "./encoder";

export class Utf8Encoder implements Encoder {
    #encoder: TextEncoder;
    #decoder: TextDecoder;

    constructor() {
        this.#encoder = new TextEncoder();
        this.#decoder = new TextDecoder("utf-8", { fatal: true });
    }

    encode(ct: Ciphertext): string {
        try {
            return this.#decoder.decode(ct.bytes);
        } catch (e) {
            throw new EncodingFailedError(`Invalid UTF-8 byte stream: ${(e as Error)?.message ?? String(e)}`);
        }
    }

    decode(s: string): Ciphertext {
        return {
            bytes: this.#encoder.encode(s),
            metadata: {
                type: "text",
                encoding: { encoding: Encoding.UTF8, base: 0 }
            }
        };
    }
}

