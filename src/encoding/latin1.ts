import { Ciphertext } from "ctes-models-ts";

// TextDecoder does not support latin1 (ISO-8859-1)
// String.fromCharCode will generate the correct character
// in latin1 range, and our bytes are only 0-255 so we iterate
// over the bytes and convert one-by-one.
export function encodeToLatin1(ct: Ciphertext): string {
    let result = "";
    ct.bytes.forEach(byte => {
        result += String.fromCharCode(byte);
    })

    return result;
}
// 224 232 236 242 249
// HEX: E0 E8 EC F2 F9
// àèìòù