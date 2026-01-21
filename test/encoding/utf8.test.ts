import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { Utf8Encoder } from "../../src/encoding/utf8"
import { EncodingFailedError } from "../../src/exceptions"

const UTF8_ENCODING: EncodingMetadata = {
    encoding: Encoding.UTF8,
    base: 0
}

describe("UTF-8 encoding tests", () => {
    const utf8Encoder: Utf8Encoder = new Utf8Encoder();

    const cases: Array<{ name: string; s: string }> = [
        { name: "empty", s: "" },
        { name: "basic ASCII", s: "Hello, world!" },
        { name: "BMP CJK", s: "世界" },
        { name: "combining mark", s: "e\u0301" },
        { name: "precomposed", s: "é" },
        { name: "astral emoji", s: "🌍" },
        { name: "ZWJ sequence", s: "👩‍💻" },
        { name: "variation selector", s: "✌️" },
        { name: "RTL text", s: "مرحبا" },
    ];

    it.each(cases)("$name: decode produces expected UTF-8 bytes", ({ s }) => {
        // TextEncoder is UTF-8 by definition.
        expect(utf8Encoder.decode(s)).toEqual(new TextEncoder().encode(s));
    });

    it.each(cases)("$name: encode round-trips back to original string", ({ s }) => {
        const bytes = new TextEncoder().encode(s);
        const ct: Ciphertext = {
            bytes: Buffer.from(bytes),
            metadata: { type: "text", encoding: UTF8_ENCODING }
        };
        expect(utf8Encoder.encode(ct)).toEqual(s);
    });

    it("encode throws EncodingFailedError on invalid UTF-8 byte sequences", () => {
        // 0xC0 0xAF is an overlong encoding (invalid UTF-8).
        const ct = {
            bytes: Uint8Array.from([0xC0, 0xAF]),
            metadata: { type: "text", encoding: UTF8_ENCODING }
        } as unknown as Ciphertext;

        expect(() => utf8Encoder.encode(ct)).toThrow(EncodingFailedError);
        expect(() => utf8Encoder.encode(ct)).toThrow(/invalid utf-8 byte stream/i);
    });
})

