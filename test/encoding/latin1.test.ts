import { Ciphertext, Encoding, EncodingMetadata } from "ctes-models-ts"
import { Latin1Encoder } from "../../src/encoding/encoders/latin1"

const LATIN1_ENCODING: EncodingMetadata = {
    encoding: Encoding.LATIN1,
    base: 0
}

describe("Latin1 encoding tests", () => {
    const latin1Encoder: Latin1Encoder = new Latin1Encoder();
    it("Correctly encodes high range characters", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("E0E8ECF2F9", "hex"),
            metadata: {
                type: "text",
                encoding: LATIN1_ENCODING
            }
        }

        expect(latin1Encoder.encode(ct)).toEqual("àèìòù");
    })

    it("Correctly encodes text from standard ascii range", () => {
        const ct: Ciphertext = {
            bytes: Buffer.from("74657374696e67", "hex"),
            metadata: {
                type: "text",
                encoding: LATIN1_ENCODING
            }
        }

        expect(latin1Encoder.encode(ct)).toEqual("testing");
    })
})

