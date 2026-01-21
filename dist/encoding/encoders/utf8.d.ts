import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "../encoder";
export declare class Utf8Encoder implements Encoder {
    #private;
    constructor();
    encode(ct: Ciphertext): string;
    decode(s: string): Ciphertext;
}
//# sourceMappingURL=utf8.d.ts.map