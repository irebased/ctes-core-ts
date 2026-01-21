import { Ciphertext, EncodingMetadata } from "ctes-models-ts";
export interface Encoder {
    encode: (ct: Ciphertext) => string;
    decode: (s: string) => Ciphertext;
}
export declare function encode(ct: Ciphertext): string;
export declare function decode(s: string, encoding: EncodingMetadata): Ciphertext;
//# sourceMappingURL=encoder.d.ts.map