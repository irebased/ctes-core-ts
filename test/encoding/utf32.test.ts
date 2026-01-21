import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { Utf32Encoder } from "../../src/encoding/utf32"
import { EncodingFailedError } from "../../src/exceptions"

const UTF32_ENCODING: EncodingMetadata = {
    encoding: Encoding.UTF32,
    base: 0
}

describe("UTF-32 encoding tests", () => {
    const utf32Encoder: Utf32Encoder = new Utf32Encoder();

    function toUtf32LEBytes(s: string): Uint8Array {
        const codePoints = Array.from(s, (ch) => ch.codePointAt(0)!);
        const bytes = new Uint8Array(codePoints.length * 4);
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        for (let i = 0; i < codePoints.length; i++) {
            view.setUint32(i * 4, codePoints[i], true);
        }
        return bytes;
    }

    it("Correctly encodes valid UTF-32", () => {
        const ct: Ciphertext = {
            // For a UTF-32 encoder test, the ciphertext bytes must be UTF-32LE encoded.
            bytes: Buffer.from(toUtf32LEBytes("Hello 世界! 🌍")),
            metadata: {
                type: "text",
                encoding: UTF32_ENCODING
            }
        }

        expect(utf32Encoder.encode(ct)).toEqual("Hello 世界! 🌍");
    });

    it("Correctly decodes valid UTF-32", () => {
        const ct = utf32Encoder.decode("Hello 世界! 🌍");
        expect(ct.bytes).toEqual(Uint8Array.from([
            72, 0, 0, 0, 101, 0, 0, 0,
            108, 0, 0, 0, 108, 0, 0, 0,
            111, 0, 0, 0, 32, 0, 0, 0,
            22, 78, 0, 0, 76, 117, 0, 0,
            33, 0, 0, 0, 32, 0, 0, 0,
            13, 243, 1, 0
        ]));
        expect(ct.metadata?.type).toEqual("text");
        expect(ct.metadata?.encoding?.encoding).toEqual(Encoding.UTF32);
    });

    describe("Round-trip UTF-32 encode/decode over diverse inputs", () => {
        const cases: Array<{ name: string; s: string }> = [
            { name: "empty string", s: "" },
            { name: "basic ASCII", s: "Hello, world!" },
            { name: "ASCII with NUL", s: "A\u0000B" },
            { name: "BMP CJK", s: "世界" },
            { name: "mixed BMP", s: "Hello 世界!" },
            { name: "combining mark (e + ◌́)", s: "e\u0301" },
            { name: "precomposed é", s: "é" },
            { name: "astral emoji", s: "🌍" },
            { name: "multiple emoji", s: "😀😃😄😁😆" },
            { name: "variation selector", s: "✌️" }, // U+270C U+FE0F
            { name: "ZWJ sequence", s: "👩‍💻" }, // woman + ZWJ + laptop
            { name: "regional indicators flag", s: "🇺🇸" },
            { name: "musical symbol G clef", s: "𝄞" }, // U+1D11E
            { name: "Hebrew", s: "שלום" },
            { name: "Arabic", s: "مرحبا" },
            { name: "Hindi", s: "नमस्ते" },
        ];

        it.each(cases)("$name: decode matches expected UTF-32LE bytes", ({ s }) => {
            expect(utf32Encoder.decode(s).bytes).toEqual(toUtf32LEBytes(s));
        });

        it.each(cases)("$name: encode(expectedBytes) reconstructs original string", ({ s }) => {
            const ct = {
                bytes: Buffer.from(toUtf32LEBytes(s)),
                metadata: { type: "text", encoding: UTF32_ENCODING }
            } as unknown as Ciphertext;
            expect(utf32Encoder.encode(ct)).toEqual(s);
        });
    });

    describe("Exception handling", () => {
        it("encode throws when byte length is not a multiple of 4", () => {
            const ct = {
                bytes: Uint8Array.from([0x00, 0x01, 0x02]),
                metadata: { type: "text", encoding: UTF32_ENCODING }
            } as unknown as Ciphertext;
            expect(() => utf32Encoder.encode(ct))
                .toThrow(new EncodingFailedError("Invalid UTF-32 byte stream length: must be a multiple of 4."));
        });

        it("encode throws on surrogate code points encoded in UTF-32", () => {
            const bytes = new Uint8Array(4);
            new DataView(bytes.buffer).setUint32(0, 0xD800, true); // high surrogate range start
            const ct = {
                bytes,
                metadata: { type: "text", encoding: UTF32_ENCODING }
            } as unknown as Ciphertext;
            expect(() => utf32Encoder.encode(ct))
                .toThrow(new EncodingFailedError("Invalid UTF-32 code point: 55296."));
        });

        it("encode throws on out-of-range code points (> 0x10FFFF)", () => {
            const bytes = new Uint8Array(4);
            new DataView(bytes.buffer).setUint32(0, 0x110000, true);
            const ct = {
                bytes,
                metadata: { type: "text", encoding: UTF32_ENCODING }
            } as unknown as Ciphertext;
            expect(() => utf32Encoder.encode(ct))
                .toThrow(new EncodingFailedError("Invalid UTF-32 code point: 1114112."));
        });
    });
})

