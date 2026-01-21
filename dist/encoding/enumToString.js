"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEncodingName = getEncodingName;
const ctes_models_ts_1 = require("ctes-models-ts");
const exceptions_1 = require("../exceptions");
const ENCODINGS = {
    ASCII: 'ASCII',
    LATIN1: 'LATIN1',
    UTF8: 'UTF-8',
    UTF16: 'UTF-16',
    UTF32: 'UTF-32',
};
function getEncodingName(encoding, base) {
    switch (encoding) {
        case ctes_models_ts_1.Encoding.ASCII:
            return ENCODINGS.ASCII;
        case ctes_models_ts_1.Encoding.LATIN1:
            return ENCODINGS.LATIN1;
        case ctes_models_ts_1.Encoding.UTF8:
            return ENCODINGS.UTF8;
        case ctes_models_ts_1.Encoding.UTF16:
            return ENCODINGS.UTF16;
        case ctes_models_ts_1.Encoding.UTF32:
            return ENCODINGS.UTF32;
        case ctes_models_ts_1.Encoding.BASE_CONVERSION:
            if (base) {
                return `Base${base}`;
            }
            else {
                throw new exceptions_1.InvalidEncodingError("A base value was expected but not provided.");
            }
        case ctes_models_ts_1.Encoding.ENCODING_UNSPECIFIED:
            return "UNSPECIFIED";
        case ctes_models_ts_1.Encoding.UNRECOGNIZED:
            return "UNRECOGNIZED";
        default:
            throw new exceptions_1.InvalidEncodingError("Invalid encoding provided.");
    }
}
//# sourceMappingURL=enumToString.js.map