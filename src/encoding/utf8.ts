import { Ciphertext } from "ctes-models-ts";
import { EncodingFailedError } from "../exceptions";
import { Encoder } from "./encoder";

export class Utf8Encoder implements Encoder {
    #encoder: TextEncoder;
    #decoder: TextDecoder;

    constructor() {
        this.#encoder = new TextEncoder();
        // fatal=true ensures invalid UTF-8 sequences throw instead of being replaced.
        this.#decoder = new TextDecoder("utf-8", { fatal: true });
    }

    encode(ct: Ciphertext): string {
        try {
            return this.#decoder.decode(ct.bytes);
        } catch (e) {
            throw new EncodingFailedError(`Invalid UTF-8 byte stream: ${(e as Error)?.message ?? String(e)}`);
        }
    }

    decode(s: string): Uint8Array {
        return this.#encoder.encode(s);
    }
}

