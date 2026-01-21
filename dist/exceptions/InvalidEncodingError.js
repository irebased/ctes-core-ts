"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidEncodingError = void 0;
const EncodingError_1 = require("./EncodingError");
class InvalidEncodingError extends EncodingError_1.EncodingError {
    constructor(message) {
        super(message);
        this.name = 'InvalidEncodingError';
        Object.setPrototypeOf(this, InvalidEncodingError.prototype);
    }
}
exports.InvalidEncodingError = InvalidEncodingError;
//# sourceMappingURL=InvalidEncodingError.js.map