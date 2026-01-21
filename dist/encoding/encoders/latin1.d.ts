import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "../encoder";
export declare class Latin1Encoder implements Encoder {
    #private;
    constructor();
    encode(ct: Ciphertext): string;
    decode(s: string): Ciphertext;
}
//# sourceMappingURL=latin1.d.ts.map