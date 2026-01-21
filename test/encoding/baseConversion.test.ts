import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { BaseConversionEncoder } from "../../src/encoding/baseConversion"
import { encode as topLevelEncode } from "../../src/encoding/encoder"
import { EncodingFailedError, InvalidEncodingError } from "../../src/exceptions"

function makeCt(bytes: Uint8Array, base: number): Ciphertext {
    const meta: EncodingMetadata = { encoding: Encoding.BASE_CONVERSION, base };
    return {
        bytes: Buffer.from(bytes),
        metadata: { type: "text", encoding: meta }
    } as unknown as Ciphertext;
}

describe("Base conversion encoder tests", () => {
    const sampleBytes = Uint8Array.from([0, 0, 1, 2, 3, 250, 255]);
    const allZeroBytes = Uint8Array.from([0, 0, 0, 0]);

    it.each([2, 3, 8, 10, 16, 32, 36])("Round-trips bytes for base %i", (base) => {
        const enc = new BaseConversionEncoder(base);
        const s = enc.encode({ bytes: sampleBytes } as unknown as Ciphertext);
        expect(enc.decode(s)).toEqual(sampleBytes);
    });

    it("Preserves leading zero bytes for base 2..36 (via leading '0' chars)", () => {
        const enc = new BaseConversionEncoder(36);
        const s = enc.encode({ bytes: sampleBytes } as unknown as Ciphertext);
        expect(s.startsWith("00")).toBe(true);
        expect(enc.decode(s)).toEqual(sampleBytes);
    });

    it("All-zero byte arrays round-trip without changing length (base 2..36)", () => {
        const enc = new BaseConversionEncoder(36);
        const s = enc.encode({ bytes: allZeroBytes } as unknown as Ciphertext);
        expect(s).toEqual("0000");
        expect(enc.decode(s)).toEqual(allZeroBytes);
    });

    it("Base64 encoding matches Node's base64 and round-trips", () => {
        const enc = new BaseConversionEncoder(64);
        const s = enc.encode({ bytes: sampleBytes } as unknown as Ciphertext);
        expect(s).toEqual(Buffer.from(sampleBytes).toString("base64"));
        expect(enc.decode(s)).toEqual(sampleBytes);
    });

    it("Top-level encode routes BASE_CONVERSION and uses metadata.base", () => {
        const ct = makeCt(sampleBytes, 64);
        expect(topLevelEncode(ct)).toEqual(Buffer.from(sampleBytes).toString("base64"));
    });

    it("Factory/base conversion throws when base is missing", () => {
        expect(() => new BaseConversionEncoder(undefined as unknown as number))
            .toThrow(InvalidEncodingError);
    });

    it("Throws on invalid base (e.g. 0, 37, 63)", () => {
        expect(() => new BaseConversionEncoder(0)).toThrow(InvalidEncodingError);
        expect(() => new BaseConversionEncoder(1)).toThrow(InvalidEncodingError);
        expect(() => new BaseConversionEncoder(37)).toThrow(InvalidEncodingError);
        expect(() => new BaseConversionEncoder(63)).toThrow(InvalidEncodingError);
    });

    it("Base64 decoder throws on invalid strings", () => {
        const enc = new BaseConversionEncoder(64);
        expect(() => enc.decode("%%%")).toThrow(EncodingFailedError);
        expect(() => enc.decode("abc")).toThrow(EncodingFailedError); // not multiple of 4
    });

    it("BaseN decoder throws on invalid characters", () => {
        const enc = new BaseConversionEncoder(16);
        expect(() => enc.decode("zzz")).toThrow(EncodingFailedError);
    });
})

