import { Encoding } from "ctes-models-ts";
import { AsciiEncoder } from "./ascii";
import { InvalidEncodingError } from "../exceptions";
import { getEncodingName } from "./enumToString";
import { Latin1Encoder } from "./latin1";
import { Utf32Encoder } from "./utf32";
import { Utf8Encoder } from "./utf8";
import { Utf16Encoder } from "./utf16";


export function getEncoder(encoding: Encoding, base?: number) {
    switch (encoding) {
        case Encoding.ASCII:
            return new AsciiEncoder();
        case Encoding.LATIN1:
            return new Latin1Encoder();
        case Encoding.BASE_CONVERSION:
            // TODO: Implement base conversion encoder which implements the encoder interface.
            // NOTE: This must pass in the base value from the encoding metadata.
            throw new InvalidEncodingError("Base conversion encoder not implemented.");
        case Encoding.UTF8:
            return new Utf8Encoder();
        case Encoding.UTF16:
            return new Utf16Encoder();
        case Encoding.UTF32:
            return new Utf32Encoder();
        case Encoding.ENCODING_UNSPECIFIED:
            throw new InvalidEncodingError("Encoding unspecified.");
        case Encoding.UNRECOGNIZED:
        default:
            throw new InvalidEncodingError(`Unsupported encoding: ${getEncodingName(encoding)}`)
    }
}