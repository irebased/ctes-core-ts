import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { Utf16Encoder } from "../../src/encoding/utf16"
import { encode as u8ToUtf16Encode } from "uint8-to-utf16"

const UTF16_ENCODING: EncodingMetadata = {
    encoding: Encoding.UTF16,
    base: 0
}

describe("UTF-16 (uint8-to-utf16) encoding tests", () => {
    const utf16Encoder: Utf16Encoder = new Utf16Encoder();

    const cases: Array<{ name: string; bytes: Uint8Array }> = [
        { name: "empty", bytes: Uint8Array.from([]) },
        { name: "single zero byte", bytes: Uint8Array.from([0x00]) },
        { name: "ascending 0..255", bytes: Uint8Array.from(Array.from({ length: 256 }, (_, i) => i)) },
        { name: "random-ish pattern", bytes: Uint8Array.from([0xFF, 0x00, 0x80, 0x7F, 0x01, 0x02, 0xFE]) },
    ];

    it.each(cases)("$name: encode is reversible", ({ bytes }) => {
        const ct: Ciphertext = {
            bytes: Buffer.from(bytes),
            metadata: { type: "text", encoding: UTF16_ENCODING }
        };
        const encoded1 = utf16Encoder.encode(ct);
        const encoded2 = utf16Encoder.encode(ct);
        // Deterministic for a given input within a process.
        expect(encoded1).toEqual(encoded2);
        // And matches the reference implementation.
        expect(encoded1).toEqual(u8ToUtf16Encode(bytes));
    });

    it.each(cases)("$name: decode(encode(bytes)) round-trips back to original bytes", ({ bytes }) => {
        const ct: Ciphertext = {
            bytes: Buffer.from(bytes),
            metadata: { type: "text", encoding: UTF16_ENCODING }
        };
        const encoded = utf16Encoder.encode(ct);
        const decodedCt = utf16Encoder.decode(encoded);
        expect(decodedCt.bytes).toEqual(bytes);
        expect(decodedCt.metadata?.type).toEqual("text");
        expect(decodedCt.metadata?.encoding?.encoding).toEqual(Encoding.UTF16);
    });
})

