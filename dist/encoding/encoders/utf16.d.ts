import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "../encoder";
export declare class Utf16Encoder implements Encoder {
    constructor();
    encode(ct: Ciphertext): string;
    decode(s: string): Ciphertext;
}
//# sourceMappingURL=utf16.d.ts.map