import { Encoding } from "ctes-models-ts";
import { AsciiEncoder } from "./ascii";
import { InvalidEncodingError } from "../exceptions";
import { getEncodingName } from "./enumToString";
import { Latin1Encoder } from "./latin1";


export function getEncoder(encoding: Encoding) {
    switch (encoding) {
            case Encoding.ASCII:
                return new AsciiEncoder();
            case Encoding.LATIN1:
                return new Latin1Encoder();
            case Encoding.ENCODING_UNSPECIFIED:
                throw new InvalidEncodingError("Encoding unspecified.");
            case Encoding.UNRECOGNIZED:
            default:
                throw new InvalidEncodingError(`Unsupported encoding: ${getEncodingName(encoding)}`)
        }
}