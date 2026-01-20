import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { encodeToLatin1 } from "../../src/encoding/latin1"
import { encodeToAscii } from "../../src/encoding/ascii"
import { EncodingFailedError, InvalidEncodingError } from "../../src/exceptions"
import { encode } from "../../src/encoding/encoder"

const LATIN1_ENCODING: EncodingMetadata = {
    encoding: Encoding.LATIN1,
    base: 0
}

const ASCII_ENCODING: EncodingMetadata = {
    encoding: Encoding.ASCII,
    base: 0
}

const INVALID_ENCODING: EncodingMetadata = {
    encoding: Encoding.UNRECOGNIZED,
    base: 0
}

const UNSPECIFIED_ENCODING: EncodingMetadata = {
    encoding: Encoding.ENCODING_UNSPECIFIED,
    base: 0
}

describe("ASCII encoding tests", () => {
    it("Correctly encodes valid ASCII", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("74657374696e67", "hex"),
            metadata: {
                type: "text",
                encoding: ASCII_ENCODING
            }
        }

        expect(encodeToAscii(ct)).toEqual("testing");
    });

    it("Raises error for invalid ASCII", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("f0f0f0", "hex"),
            metadata: {
                type: "text",
                encoding: ASCII_ENCODING
            }
        }

        expect(() => encodeToAscii(ct))
        .toThrow(new EncodingFailedError(
            "One or more bytes in the byte stream contained a value over 127."
        ));
    })
})

describe("Latin1 encoding tests", () => {
    it("Correctly encodes high range characters", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("E0E8ECF2F9", "hex"),
            metadata: {
                type: "text",
                encoding: LATIN1_ENCODING
            }
        }

        expect(encodeToLatin1(ct)).toEqual("àèìòù");
    })

    it("Correctly encodes text from standard ascii range", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("74657374696e67", "hex"),
            metadata: {
                type: "text",
                encoding: LATIN1_ENCODING
            }
        }

        expect(encodeToLatin1(ct)).toEqual("testing");
    })
})

describe("Top-level encoder tests", () => {
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