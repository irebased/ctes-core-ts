"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingEncodingMetadataError = void 0;
const EncodingError_1 = require("./EncodingError");
class MissingEncodingMetadataError extends EncodingError_1.EncodingError {
    constructor(message) {
        super(message);
        this.name = 'MissingEncodingMetadataError';
        Object.setPrototypeOf(this, MissingEncodingMetadataError.prototype);
    }
}
exports.MissingEncodingMetadataError = MissingEncodingMetadataError;
//# sourceMappingURL=MissingEncodingMetadataError.js.map