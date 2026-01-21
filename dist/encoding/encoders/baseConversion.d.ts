import { Ciphertext } from "ctes-models-ts";
import { Encoder } from "../encoder";
export declare class BaseConversionEncoder implements Encoder {
    #private;
    constructor(base: number);
    encode(ct: Ciphertext): string;
    decode(s: string): Ciphertext;
}
//# sourceMappingURL=baseConversion.d.ts.map