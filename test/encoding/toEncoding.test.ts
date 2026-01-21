import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { EncodingFailedError, InvalidEncodingError } from "../../src/exceptions"
import { toEncoding } from "../../src/encoding/encoder"
import { getEncoder } from "../../src/encoding/encoderFactory"

const ASCII_ENCODING: EncodingMetadata = { encoding: Encoding.ASCII, base: 0 }
const UTF8_ENCODING: EncodingMetadata = { encoding: Encoding.UTF8, base: 0 }
const UTF32_ENCODING: EncodingMetadata = { encoding: Encoding.UTF32, base: 0 }

describe("toEncoding", () => {
    it("Retags ciphertext to a target encoding when bytes are valid (ASCII -> UTF8)", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("testing", "utf8"),
            metadata: { type: "text", encoding: ASCII_ENCODING }
        };

        const converted = toEncoding(ct, UTF8_ENCODING);
        expect(converted.bytes).toEqual(ct.bytes);
        expect(converted.metadata?.type).toEqual("text");
        expect(converted.metadata?.encoding).toEqual(UTF8_ENCODING);
    });

    it("Throws when bytes are invalid for the target encoding (ASCII)", () => {
        const ct: Ciphertext = {
            bytes: Uint8Array.from([0xF0, 0xF0]),
            metadata: { type: "text", encoding: UTF8_ENCODING }
        };
        expect(() => toEncoding(ct, ASCII_ENCODING)).toThrow(EncodingFailedError);
    });

    it("Works for UTF-32 when length/code points are valid", () => {
        const utf32 = getEncoder(Encoding.UTF32) as any;
        const ct = utf32.decode("Hi") as Ciphertext; // produces valid UTF-32LE bytes
        const converted = toEncoding(ct, UTF32_ENCODING);
        expect(converted.bytes).toEqual(ct.bytes);
        expect(converted.metadata?.encoding).toEqual(UTF32_ENCODING);
    });

    it("Throws for UTF-32 when byte length is invalid", () => {
        const ct: Ciphertext = {
            bytes: Uint8Array.from([0, 1, 2]),
            metadata: { type: "text", encoding: UTF8_ENCODING }
        };
        expect(() => toEncoding(ct, UTF32_ENCODING)).toThrow(EncodingFailedError);
    });

    it("Throws when BASE_CONVERSION is requested without a base", () => {
        const ct: Ciphertext = {
            bytes: Uint8Array.from([1, 2, 3]),
            metadata: { type: "text", encoding: UTF8_ENCODING }
        };
        expect(() => toEncoding(ct, { encoding: Encoding.BASE_CONVERSION } as unknown as EncodingMetadata))
            .toThrow(InvalidEncodingError);
    });
})

