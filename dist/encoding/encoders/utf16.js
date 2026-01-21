"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utf16Encoder = void 0;
const ctes_models_ts_1 = require("ctes-models-ts");
const uint8_to_utf16_1 = require("uint8-to-utf16");
// This encoder uses `uint8-to-utf16` to provide a *lossless* mapping between arbitrary bytes and a JS string.
// See: https://github.com/WebReflection/uint8-to-utf16
class Utf16Encoder {
    constructor() { }
    encode(ct) {
        return (0, uint8_to_utf16_1.encode)(ct.bytes);
    }
    decode(s) {
        return {
            bytes: (0, uint8_to_utf16_1.decode)(s),
            metadata: {
                type: "text",
                encoding: { encoding: ctes_models_ts_1.Encoding.UTF16, base: 0 }
            }
        };
    }
}
exports.Utf16Encoder = Utf16Encoder;
//# sourceMappingURL=utf16.js.map