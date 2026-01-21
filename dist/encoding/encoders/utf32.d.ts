import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "../encoder";
export declare class Utf32Encoder implements Encoder {
    constructor();
    encode(ct: Ciphertext): string;
    decode(s: string): Ciphertext;
}
//# sourceMappingURL=utf32.d.ts.map