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
var _Latin1Encoder_encoder;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latin1Encoder = void 0;
const ctes_models_ts_1 = require("ctes-models-ts");
class Latin1Encoder {
    constructor() {
        _Latin1Encoder_encoder.set(this, void 0);
        __classPrivateFieldSet(this, _Latin1Encoder_encoder, new TextEncoder(), "f");
    }
    // TextDecoder does not support latin1 (ISO-8859-1)
    // String.fromCharCode will generate the correct character
    // in latin1 range, and our bytes are only 0-255 so we iterate
    // over the bytes and convert one-by-one.
    encode(ct) {
        let result = "";
        ct.bytes.forEach(byte => {
            result += String.fromCharCode(byte);
        });
        return result;
    }
    decode(s) {
        return {
            bytes: __classPrivateFieldGet(this, _Latin1Encoder_encoder, "f").encode(s),
            metadata: {
                type: "text",
                encoding: { encoding: ctes_models_ts_1.Encoding.LATIN1, base: 0 }
            }
        };
    }
}
exports.Latin1Encoder = Latin1Encoder;
_Latin1Encoder_encoder = new WeakMap();
//# sourceMappingURL=latin1.js.map