import { Encoding } from "ctes-models-ts";
import { InvalidEncodingError } from "../exceptions";

const ENCODINGS = {
    ASCII: 'ASCII',
    LATIN1: 'LATIN1',
    UTF8: 'UTF-8',
    UTF16: 'UTF-16',
    UTF32: 'UTF-32',

}

export function getEncodingName(encoding: Encoding, base?: number): string {
    switch (encoding) {
        case Encoding.ASCII:
            return ENCODINGS.ASCII
        case Encoding.LATIN1:
            return ENCODINGS.LATIN1
        case Encoding.UTF8:
            return ENCODINGS.UTF8
        case Encoding.UTF16:
            return ENCODINGS.UTF16
        case Encoding.UTF32:
            return ENCODINGS.UTF32
        case Encoding.BASE_CONVERSION:
            if (base) {
                return `Base${base}`
            } else {
                throw new InvalidEncodingError("A base value was expected but not provided.")
            }
        case Encoding.ENCODING_UNSPECIFIED:
            return "UNSPECIFIED";
        case Encoding.UNRECOGNIZED:
            return "UNRECOGNIZED";
        default:
            throw new InvalidEncodingError("Invalid encoding provided.");
    }
}