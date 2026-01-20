import { Ciphertext } from "ctes-models-ts";
import { EncodingFailedError } from "../exceptions";

export function encodeToAscii(ct: Ciphertext): string {
    if (ct.bytes.some(byte => byte > 127)) {
        throw new EncodingFailedError("One or more bytes in the byte stream contained a value over 127.");
    }
    const decoder = new TextDecoder('ascii');
    return decoder.decode(ct.bytes);
}