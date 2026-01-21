import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "../encoder";
export declare class AsciiEncoder implements Encoder {
    #private;
    constructor();
    encode(ct: Ciphertext): string;
    decode(s: string): Ciphertext;
}
//# sourceMappingURL=ascii.d.ts.map