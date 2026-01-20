import { Ciphertext, Encoding } from "ctes-models-ts";
import { InvalidEncodingError, MissingEncodingMetadataError } from "../exceptions";
import { encodeToAscii } from "./ascii";
import { encodeToLatin1 } from "./latin1";
import { getEncodingName } from "./enumToString";

export function encode(ct: Ciphertext): string {
    if (!ct.metadata || !ct.metadata.encoding) {
        throw new MissingEncodingMetadataError(`The provided ciphertext does not have encoding metadata: ${ct}.`);
    }

    switch (ct.metadata.encoding.encoding) {
        case Encoding.ASCII:
            return encodeToAscii(ct);
        case Encoding.LATIN1:
            return encodeToLatin1(ct);
        case Encoding.ENCODING_UNSPECIFIED:
            throw new InvalidEncodingError("Encoding unspecified.");
        case Encoding.UNRECOGNIZED:
        default:
            throw new InvalidEncodingError(`Unsupported encoding: ${getEncodingName(ct.metadata.encoding.encoding)}`)
    }
}