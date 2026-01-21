import { Ciphertext } from "ctes-models-ts";
import { MissingEncodingMetadataError } from "../exceptions";
import { getEncoder } from "./encoderFactory";

export interface Encoder {
    encode: (ct: Ciphertext) => string;
    decode: (s: string) => Uint8Array;
}

export function encode(ct: Ciphertext): string {
    if (!ct.metadata || !ct.metadata.encoding) {
        throw new MissingEncodingMetadataError(`The provided ciphertext does not have encoding metadata: ${ct}.`);
    }

    const encoder: Encoder = getEncoder(ct.metadata.encoding.encoding);
    return encoder.encode(ct);
}