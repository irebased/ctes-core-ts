import { Encoding } from "ctes-models-ts";
import { AsciiEncoder } from "./encoders/ascii";
import { Latin1Encoder } from "./encoders/latin1";
import { Utf32Encoder } from "./encoders/utf32";
import { Utf8Encoder } from "./encoders/utf8";
import { Utf16Encoder } from "./encoders/utf16";
import { BaseConversionEncoder } from "./encoders/baseConversion";
export declare function getEncoder(encoding: Encoding, base?: number): AsciiEncoder | Latin1Encoder | Utf32Encoder | Utf8Encoder | Utf16Encoder | BaseConversionEncoder;
//# sourceMappingURL=encoderFactory.d.ts.map