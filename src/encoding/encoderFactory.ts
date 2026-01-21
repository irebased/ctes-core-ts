import { Encoding } from "ctes-models-ts";
import { AsciiEncoder } from "./encoders/ascii";
import { InvalidEncodingError } from "../exceptions";
import { getEncodingName } from "./enumToString";
import { Latin1Encoder } from "./encoders/latin1";
import { Utf32Encoder } from "./encoders/utf32";
import { Utf8Encoder } from "./encoders/utf8";
import { Utf16Encoder } from "./encoders/utf16";
import { BaseConversionEncoder } from "./encoders/baseConversion";


export function getEncoder(encoding: Encoding, base?: number) {
    switch (encoding) {
        case Encoding.ASCII:
            return new AsciiEncoder();
        case Encoding.LATIN1:
            return new Latin1Encoder();
        case Encoding.BASE_CONVERSION:
            if (base === undefined || base === null) {
                throw new InvalidEncodingError("A base value was expected but not provided.");
            }
            return new BaseConversionEncoder(base);
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