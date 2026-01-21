import { Ciphertext, EncodingMetadata } from "ctes-models-ts";
import { MissingEncodingMetadataError } from "../exceptions";
import { getEncoder } from "./encoderFactory";

export interface Encoder {
    encode: (ct: Ciphertext) => string;
    decode: (s: string) => Ciphertext;
}

export function encode(ct: Ciphertext): string {
    if (!ct.metadata || !ct.metadata.encoding) {
        throw new MissingEncodingMetadataError(`The provided ciphertext does not have encoding metadata: ${ct}.`);
    }

    const encoder: Encoder = getEncoder(ct.metadata.encoding.encoding, ct.metadata.encoding.base);
    return encoder.encode(ct);
}

export function decode(s: string, encoding: EncodingMetadata): Ciphertext {
    const encoder: Encoder = getEncoder(encoding.encoding, encoding.base);
    return encoder.decode(s);
}

export function toEncoding(ct: Ciphertext, targetEncoding: EncodingMetadata): Ciphertext {
    const encoder: Encoder = getEncoder(targetEncoding.encoding, targetEncoding.base);
    encoder.encode(ct);

    return {
        bytes: ct.bytes,
        metadata: {
            type: "text",
            encoding: targetEncoding
        }
    };
}