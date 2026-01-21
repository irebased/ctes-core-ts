import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { InvalidEncodingError, MissingEncodingMetadataError } from "../../src/exceptions"
import { encode } from "../../src/encoding/encoder"

const INVALID_ENCODING: EncodingMetadata = {
    encoding: Encoding.UNRECOGNIZED,
    base: 0
}

const UNSPECIFIED_ENCODING: EncodingMetadata = {
    encoding: Encoding.ENCODING_UNSPECIFIED,
    base: 0
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
})