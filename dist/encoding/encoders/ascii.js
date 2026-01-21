"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AsciiEncoder_encoder, _AsciiEncoder_decoder;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsciiEncoder = void 0;
const ctes_models_ts_1 = require("ctes-models-ts");
const exceptions_1 = require("../../exceptions");
class AsciiEncoder {
    constructor() {
        _AsciiEncoder_encoder.set(this, void 0);
        _AsciiEncoder_decoder.set(this, void 0);
        __classPrivateFieldSet(this, _AsciiEncoder_encoder, new TextEncoder(), "f");
        __classPrivateFieldSet(this, _AsciiEncoder_decoder, new TextDecoder('ascii'), "f");
    }
    encode(ct) {
        if (ct.bytes.some(byte => byte > 127)) {
            throw new exceptions_1.EncodingFailedError("One or more bytes in the byte stream contained a value over 127.");
        }
        return __classPrivateFieldGet(this, _AsciiEncoder_decoder, "f").decode(ct.bytes);
    }
    decode(s) {
        return {
            bytes: __classPrivateFieldGet(this, _AsciiEncoder_encoder, "f").encode(s),
            metadata: {
                type: "text",
                encoding: { encoding: ctes_models_ts_1.Encoding.ASCII, base: 0 }
            }
        };
    }
}
exports.AsciiEncoder = AsciiEncoder;
_AsciiEncoder_encoder = new WeakMap(), _AsciiEncoder_decoder = new WeakMap();
//# sourceMappingURL=ascii.js.map