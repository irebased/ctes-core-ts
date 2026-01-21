import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { AsciiEncoder } from "../../src/encoding/ascii"
import { EncodingFailedError } from "../../src/exceptions"

const ASCII_ENCODING: EncodingMetadata = {
    encoding: Encoding.ASCII,
    base: 0
}

describe("ASCII encoding tests", () => {
    const asciiEncoder: AsciiEncoder = new AsciiEncoder();
    it("Correctly encodes valid ASCII", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("74657374696e67", "hex"),
            metadata: {
                type: "text",
                encoding: ASCII_ENCODING
            }
        }

        expect(asciiEncoder.encode(ct)).toEqual("testing");
    });

    it("Raises error for invalid ASCII", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("f0f0f0", "hex"),
            metadata: {
                type: "text",
                encoding: ASCII_ENCODING
            }
        }

        expect(() => asciiEncoder.encode(ct))
            .toThrow(new EncodingFailedError(
                "One or more bytes in the byte stream contained a value over 127."
            ));
    })
})

