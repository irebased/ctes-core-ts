"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEncoder = getEncoder;
const ctes_models_ts_1 = require("ctes-models-ts");
const ascii_1 = require("./encoders/ascii");
const exceptions_1 = require("../exceptions");
const enumToString_1 = require("./enumToString");
const latin1_1 = require("./encoders/latin1");
const utf32_1 = require("./encoders/utf32");
const utf8_1 = require("./encoders/utf8");
const utf16_1 = require("./encoders/utf16");
const baseConversion_1 = require("./encoders/baseConversion");
function getEncoder(encoding, base) {
    switch (encoding) {
        case ctes_models_ts_1.Encoding.ASCII:
            return new ascii_1.AsciiEncoder();
        case ctes_models_ts_1.Encoding.LATIN1:
            return new latin1_1.Latin1Encoder();
        case ctes_models_ts_1.Encoding.BASE_CONVERSION:
            if (base === undefined || base === null) {
                throw new exceptions_1.InvalidEncodingError("A base value was expected but not provided.");
            }
            return new baseConversion_1.BaseConversionEncoder(base);
        case ctes_models_ts_1.Encoding.UTF8:
            return new utf8_1.Utf8Encoder();
        case ctes_models_ts_1.Encoding.UTF16:
            return new utf16_1.Utf16Encoder();
        case ctes_models_ts_1.Encoding.UTF32:
            return new utf32_1.Utf32Encoder();
        case ctes_models_ts_1.Encoding.ENCODING_UNSPECIFIED:
            throw new exceptions_1.InvalidEncodingError("Encoding unspecified.");
        case ctes_models_ts_1.Encoding.UNRECOGNIZED:
        default:
            throw new exceptions_1.InvalidEncodingError(`Unsupported encoding: ${(0, enumToString_1.getEncodingName)(encoding)}`);
    }
}
//# sourceMappingURL=encoderFactory.js.map