import { Ciphertext } from "ctes-models-ts";
import { EncodingFailedError, InvalidEncodingError } from "../exceptions";
import { Encoder } from "./encoder";

const ALPHABET_36 = "0123456789abcdefghijklmnopqrstuvwxyz";
const ALPHABET_64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function assertSupportedBase(base: number) {
    if (!Number.isInteger(base)) {
        throw new InvalidEncodingError(`Base must be an integer. Got: ${base}`);
    }
    if (base === 64) return;
    if (base < 2 || base > 36) {
        throw new InvalidEncodingError(`Unsupported base: ${base}. Supported: 2-36 and 64.`);
    }
}

function base64Encode(bytes: Uint8Array): string {
    // Node environment (jest.config.js uses testEnvironment: "node")
    return Buffer.from(bytes).toString("base64");
}

function isValidBase64(s: string): boolean {
    // RFC 4648 base64 with optional padding. Also allow empty string.
    // - length must be multiple of 4
    // - allowed chars A-Z a-z 0-9 + / and up to two '=' padding at end
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s);
}

function base64Decode(s: string): Uint8Array {
    if (!isValidBase64(s)) {
        throw new EncodingFailedError("Invalid base64 string.");
    }
    return Uint8Array.from(Buffer.from(s, "base64"));
}

function getAlphabet(base: number): string {
    if (base === 64) return ALPHABET_64;
    return ALPHABET_36.slice(0, base);
}

// Base-x style conversion (preserves leading zero bytes by prefixing alphabet[0]).
function baseNEncode(bytes: Uint8Array, base: number): string {
    const alphabet = getAlphabet(base);
    if (bytes.length === 0) return "";

    // Count leading zeros.
    let zeros = 0;
    while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
    if (zeros === bytes.length) {
        // All zero bytes => preserve exact length.
        return alphabet[0].repeat(zeros);
    }

    const digits: number[] = [0];
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

function baseNDecode(s: string, base: number): Uint8Array {
    const alphabet = getAlphabet(base);
    if (s.length === 0) return new Uint8Array();

    // Map char -> value
    const map = new Map<string, number>();
    for (let i = 0; i < alphabet.length; i++) map.set(alphabet[i], i);

    // Count leading zeros.
    let zeros = 0;
    while (zeros < s.length && s[zeros] === alphabet[0]) zeros++;
    if (zeros === s.length) {
        // All leading-zero characters => represents all-zero bytes of same length.
        return new Uint8Array(zeros);
    }

    const bytes: number[] = [0];
    for (let i = zeros; i < s.length; i++) {
        const ch = s[i];
        const val = map.get(ch);
        if (val === undefined) {
            throw new EncodingFailedError(`Invalid character '${ch}' for base${base}.`);
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
    // zeros are already 0
    for (let i = 0; i < bytes.length; i++) {
        out[out.length - 1 - i] = bytes[i];
    }
    return out;
}

export class BaseConversionEncoder implements Encoder {
    #base: number;

    constructor(base: number) {
        assertSupportedBase(base);
        this.#base = base;
    }

    encode(ct: Ciphertext): string {
        const bytes = ct.bytes;
        if (this.#base === 64) return base64Encode(bytes);
        return baseNEncode(bytes, this.#base);
    }

    decode(s: string): Uint8Array {
        if (this.#base === 64) return base64Decode(s);
        return baseNDecode(s, this.#base);
    }
}

