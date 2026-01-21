"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = encode;
exports.decode = decode;
const exceptions_1 = require("../exceptions");
const encoderFactory_1 = require("./encoderFactory");
function encode(ct) {
    if (!ct.metadata || !ct.metadata.encoding) {
        throw new exceptions_1.MissingEncodingMetadataError(`The provided ciphertext does not have encoding metadata: ${ct}.`);
    }
    const encoder = (0, encoderFactory_1.getEncoder)(ct.metadata.encoding.encoding, ct.metadata.encoding.base);
    return encoder.encode(ct);
}
function decode(s, encoding) {
    const encoder = (0, encoderFactory_1.getEncoder)(encoding.encoding, encoding.base);
    return encoder.decode(s);
}
//# sourceMappingURL=encoder.js.map