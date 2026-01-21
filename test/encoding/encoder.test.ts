import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { EncodingFailedError, InvalidEncodingError, MissingEncodingMetadataError } from "../../src/exceptions"
import { decode, encode } from "../../src/encoding/encoder"
import { getEncoder } from "../../src/encoding/encoderFactory"
import { encode as u8ToUtf16Encode } from "uint8-to-utf16"

const INVALID_ENCODING: EncodingMetadata = {
    encoding: Encoding.UNRECOGNIZED,
    base: 0
}

const UNSPECIFIED_ENCODING: EncodingMetadata = {
    encoding: Encoding.ENCODING_UNSPECIFIED,
    base: 0
}

const UTF8_ENCODING: EncodingMetadata = {
    encoding: Encoding.UTF8,
    base: 0
}

const UTF16_ENCODING: EncodingMetadata = {
    encoding: Encoding.UTF16,
    base: 0
}

const UTF32_ENCODING: EncodingMetadata = {
    encoding: Encoding.UTF32,
    base: 0
}

const BASE64_ENCODING: EncodingMetadata = {
    encoding: Encoding.BASE_CONVERSION,
    base: 64
}

function toUtf32LEBytes(s: string): Uint8Array {
    const codePoints = Array.from(s, (ch) => ch.codePointAt(0)!);
    const bytes = new Uint8Array(codePoints.length * 4);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let i = 0; i < codePoints.length; i++) {
        view.setUint32(i * 4, codePoints[i], true);
    }
    return bytes;
}

describe("Top-level encoder tests", () => {
    it("Fails when encoding metadata is missing entirely", () => {
        const ct = { bytes: Buffer.from("74657374", "hex") } as unknown as Ciphertext;
        expect(() => encode(ct)).toThrow(MissingEncodingMetadataError);
        expect(() => encode(ct)).toThrow(/does not have encoding metadata/i);
    });

    it("Fails when encoding metadata exists but has no encoding field", () => {
        const ct = {
            bytes: Buffer.from("74657374", "hex"),
            metadata: { type: "text" }
        } as unknown as Ciphertext;
        expect(() => encode(ct)).toThrow(MissingEncodingMetadataError);
        expect(() => encode(ct)).toThrow(/does not have encoding metadata/i);
    });

    it("Fails when an unrecognized encoding is provided", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("74657374696e67", "hex"),
            metadata: {
                type: "text",
                encoding: INVALID_ENCODING
            }
        }

        expect(() => encode(ct))
            .toThrow(new InvalidEncodingError("Unsupported encoding: UNRECOGNIZED"
        ));
    });

    it("Fails when no encoding is provided", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("74657374696e67", "hex"),
            metadata: {
                type: "text",
                encoding: UNSPECIFIED_ENCODING
            }
        }

        expect(() => encode(ct)).toThrow(new InvalidEncodingError("Encoding unspecified."));
    })

    it("Uses the UTF-8 encoder when encoding metadata is UTF8", () => {
        const s = "Hello 世界! 🌍";
        const ct: Ciphertext = {
            bytes: Buffer.from(s, "utf8"),
            metadata: { type: "text", encoding: UTF8_ENCODING }
        }
        expect(encode(ct)).toEqual(s);
    });

    it("Propagates UTF-8 decoding failures as EncodingFailedError", () => {
        const ct = {
            bytes: Uint8Array.from([0xC0, 0xAF]), // invalid (overlong)
            metadata: { type: "text", encoding: UTF8_ENCODING }
        } as unknown as Ciphertext;

        expect(() => encode(ct)).toThrow(EncodingFailedError);
    });

    it("Uses the UTF-16 (LE) encoder when encoding metadata is UTF16", () => {
        const bytes = Uint8Array.from([0x00, 0xFF, 0x80, 0x7F, 0x41, 0x42, 0x10]);
        const ct: Ciphertext = {
            bytes: Buffer.from(bytes),
            metadata: { type: "text", encoding: UTF16_ENCODING }
        }
        // Assert routing + lossless round-trip (implementation may vary depending on whether uint8-to-utf16 is installed).
        const s = encode(ct);
        expect(s).toEqual(u8ToUtf16Encode(bytes));
        const utf16 = getEncoder(Encoding.UTF16) as any;
        const decoded = utf16.decode(s) as Ciphertext;
        expect(decoded.bytes).toEqual(bytes);
        expect(decoded.metadata?.encoding?.encoding).toEqual(Encoding.UTF16);
    });

    it("Uses the UTF-32 (LE) encoder when encoding metadata is UTF32", () => {
        const s = "Hello 世界! 🌍";
        const ct: Ciphertext = {
            bytes: Buffer.from(toUtf32LEBytes(s)),
            metadata: { type: "text", encoding: UTF32_ENCODING }
        }
        expect(encode(ct)).toEqual(s);
    });
})

describe("Top-level decoder tests", () => {
    it("Decodes UTF-8 into Ciphertext bytes + metadata", () => {
        const s = "Hello 世界! 🌍";
        const ct = decode(s, UTF8_ENCODING);
        expect(ct.bytes).toEqual(new TextEncoder().encode(s));
        expect(ct.metadata?.type).toEqual("text");
        expect(ct.metadata?.encoding?.encoding).toEqual(Encoding.UTF8);
    });

    it("Decodes UTF-16 into Ciphertext bytes + metadata", () => {
        const bytes = Uint8Array.from([0x00, 0xFF, 0x80, 0x7F, 0x41, 0x42, 0x10]);
        const s = u8ToUtf16Encode(bytes);
        const ct = decode(s, UTF16_ENCODING);
        expect(ct.bytes).toEqual(bytes);
        expect(ct.metadata?.type).toEqual("text");
        expect(ct.metadata?.encoding?.encoding).toEqual(Encoding.UTF16);
    });

    it("Decodes UTF-32 into Ciphertext bytes + metadata", () => {
        const s = "Hello 世界! 🌍";
        const ct = decode(s, UTF32_ENCODING);
        expect(ct.bytes).toEqual(toUtf32LEBytes(s));
        expect(ct.metadata?.type).toEqual("text");
        expect(ct.metadata?.encoding?.encoding).toEqual(Encoding.UTF32);
    });

    it("Decodes base64 (base conversion) into Ciphertext bytes + metadata (including base)", () => {
        const bytes = Uint8Array.from([0, 1, 2, 3, 250, 251, 252, 253, 254, 255]);
        const s = Buffer.from(bytes).toString("base64");
        const ct = decode(s, BASE64_ENCODING);
        expect(ct.bytes).toEqual(bytes);
        expect(ct.metadata?.type).toEqual("text");
        expect(ct.metadata?.encoding?.encoding).toEqual(Encoding.BASE_CONVERSION);
        expect(ct.metadata?.encoding?.base).toEqual(64);
    });

    it("Throws when BASE_CONVERSION decoding is requested without a base", () => {
        expect(() => decode("AA==", { encoding: Encoding.BASE_CONVERSION } as unknown as EncodingMetadata))
            .toThrow(new InvalidEncodingError("A base value was expected but not provided."));
    });

    it("Throws EncodingFailedError on invalid base64 input", () => {
        expect(() => decode("%%%", BASE64_ENCODING)).toThrow(EncodingFailedError);
    });
})