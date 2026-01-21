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
var _Utf8Encoder_encoder, _Utf8Encoder_decoder;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utf8Encoder = void 0;
const ctes_models_ts_1 = require("ctes-models-ts");
const exceptions_1 = require("../../exceptions");
class Utf8Encoder {
    constructor() {
        _Utf8Encoder_encoder.set(this, void 0);
        _Utf8Encoder_decoder.set(this, void 0);
        __classPrivateFieldSet(this, _Utf8Encoder_encoder, new TextEncoder(), "f");
        __classPrivateFieldSet(this, _Utf8Encoder_decoder, new TextDecoder("utf-8", { fatal: true }), "f");
    }
    encode(ct) {
        try {
            return __classPrivateFieldGet(this, _Utf8Encoder_decoder, "f").decode(ct.bytes);
        }
        catch (e) {
            throw new exceptions_1.EncodingFailedError(`Invalid UTF-8 byte stream: ${e?.message ?? String(e)}`);
        }
    }
    decode(s) {
        return {
            bytes: __classPrivateFieldGet(this, _Utf8Encoder_encoder, "f").encode(s),
            metadata: {
                type: "text",
                encoding: { encoding: ctes_models_ts_1.Encoding.UTF8, base: 0 }
            }
        };
    }
}
exports.Utf8Encoder = Utf8Encoder;
_Utf8Encoder_encoder = new WeakMap(), _Utf8Encoder_decoder = new WeakMap();
//# sourceMappingURL=utf8.js.map