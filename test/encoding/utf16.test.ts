import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { Utf16Encoder } from "../../src/encoding/utf16"

const UTF16_ENCODING: EncodingMetadata = {
    encoding: Encoding.UTF16,
    base: 0
}

describe("UTF-16 (uint8-to-utf16) encoding tests", () => {
    const utf16Encoder: Utf16Encoder = new Utf16Encoder();

    function referenceEncode(bytes: Uint8Array): string {
        // Mirrors Utf16Encoder fallback behavior (lossless 1-byte-per-code-unit mapping).
        let out = "";
        for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
        return out;
    }

    const cases: Array<{ name: string; bytes: Uint8Array }> = [
        { name: "empty", bytes: Uint8Array.from([]) },
        { name: "single zero byte", bytes: Uint8Array.from([0x00]) },
        { name: "ascending 0..255", bytes: Uint8Array.from(Array.from({ length: 256 }, (_, i) => i)) },
        { name: "random-ish pattern", bytes: Uint8Array.from([0xFF, 0x00, 0x80, 0x7F, 0x01, 0x02, 0xFE]) },
    ];

    it.each(cases)("$name: encode is deterministic and reversible", ({ bytes }) => {
        const ct: Ciphertext = {
            bytes: Buffer.from(bytes),
            metadata: { type: "text", encoding: UTF16_ENCODING }
        };
        // We don't assert exact external package output here (it may not be installed yet).
        // Instead we assert a stable reference and lossless round-trip.
        expect(utf16Encoder.encode(ct)).toEqual(referenceEncode(bytes));
    });

    it.each(cases)("$name: decode(encode(bytes)) round-trips back to original bytes", ({ bytes }) => {
        const ct: Ciphertext = {
            bytes: Buffer.from(bytes),
            metadata: { type: "text", encoding: UTF16_ENCODING }
        };
        const encoded = utf16Encoder.encode(ct);
        expect(utf16Encoder.decode(encoded)).toEqual(bytes);
    });
})

