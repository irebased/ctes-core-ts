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
var _BaseConversionEncoder_base;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConversionEncoder = void 0;
const ctes_models_ts_1 = require("ctes-models-ts");
const exceptions_1 = require("../../exceptions");
const ALPHABET_36 = "0123456789abcdefghijklmnopqrstuvwxyz";
const ALPHABET_64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function assertSupportedBase(base) {
    if (!Number.isInteger(base)) {
        throw new exceptions_1.InvalidEncodingError(`Base must be an integer. Got: ${base}`);
    }
    if (base === 64)
        return;
    if (base < 2 || base > 36) {
        throw new exceptions_1.InvalidEncodingError(`Unsupported base: ${base}. Supported: 2-36 and 64.`);
    }
}
function base64Encode(bytes) {
    return Buffer.from(bytes).toString("base64");
}
function isValidBase64(s) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s);
}
function base64Decode(s) {
    if (!isValidBase64(s)) {
        throw new exceptions_1.EncodingFailedError("Invalid base64 string.");
    }
    return Uint8Array.from(Buffer.from(s, "base64"));
}
function getAlphabet(base) {
    if (base === 64)
        return ALPHABET_64;
    return ALPHABET_36.slice(0, base);
}
function baseNEncode(bytes, base) {
    const alphabet = getAlphabet(base);
    if (bytes.length === 0)
        return "";
    let zeros = 0;
    while (zeros < bytes.length && bytes[zeros] === 0)
        zeros++;
    if (zeros === bytes.length) {
        return alphabet[0].repeat(zeros);
    }
    const digits = [0];
    for (let i = zeros; i < bytes.length; i++) {
        let carry = bytes[i];
        for (let j = 0; j < digits.length; j++) {
            carry += digits[j] * 256;
            digits[j] = carry % base;
            carry = (carry / base) | 0;
        }
        while (carry > 0) {
            digits.push(carry % base);
            carry = (carry / base) | 0;
        }
    }
    let out = alphabet[0].repeat(zeros);
    for (let i = digits.length - 1; i >= 0; i--) {
        out += alphabet[digits[i]];
    }
    return out;
}
function baseNDecode(s, base) {
    const alphabet = getAlphabet(base);
    if (s.length === 0)
        return new Uint8Array();
    const map = new Map();
    for (let i = 0; i < alphabet.length; i++)
        map.set(alphabet[i], i);
    let zeros = 0;
    while (zeros < s.length && s[zeros] === alphabet[0])
        zeros++;
    if (zeros === s.length) {
        return new Uint8Array(zeros);
    }
    const bytes = [0];
    for (let i = zeros; i < s.length; i++) {
        const ch = s[i];
        const val = map.get(ch);
        if (val === undefined) {
            throw new exceptions_1.EncodingFailedError(`Invalid character '${ch}' for base${base}.`);
        }
        let carry = val;
        for (let j = 0; j < bytes.length; j++) {
            carry += bytes[j] * base;
            bytes[j] = carry & 0xff;
            carry >>= 8;
        }
        while (carry > 0) {
            bytes.push(carry & 0xff);
            carry >>= 8;
        }
    }
    const out = new Uint8Array(zeros + bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        out[out.length - 1 - i] = bytes[i];
    }
    return out;
}
class BaseConversionEncoder {
    constructor(base) {
        _BaseConversionEncoder_base.set(this, void 0);
        assertSupportedBase(base);
        __classPrivateFieldSet(this, _BaseConversionEncoder_base, base, "f");
    }
    encode(ct) {
        const bytes = ct.bytes;
        if (__classPrivateFieldGet(this, _BaseConversionEncoder_base, "f") === 64)
            return base64Encode(bytes);
        return baseNEncode(bytes, __classPrivateFieldGet(this, _BaseConversionEncoder_base, "f"));
    }
    decode(s) {
        const bytes = (__classPrivateFieldGet(this, _BaseConversionEncoder_base, "f") === 64) ? base64Decode(s) : baseNDecode(s, __classPrivateFieldGet(this, _BaseConversionEncoder_base, "f"));
        return {
            bytes,
            metadata: {
                type: "text",
                encoding: { encoding: ctes_models_ts_1.Encoding.BASE_CONVERSION, base: __classPrivateFieldGet(this, _BaseConversionEncoder_base, "f") }
            }
        };
    }
}
exports.BaseConversionEncoder = BaseConversionEncoder;
_BaseConversionEncoder_base = new WeakMap();
//# sourceMappingURL=baseConversion.js.map