"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodingFailedError = void 0;
const EncodingError_1 = require("./EncodingError");
class EncodingFailedError extends EncodingError_1.EncodingError {
    constructor(message) {
        super(message);
        this.name = 'EncodingFailedError';
        Object.setPrototypeOf(this, EncodingFailedError.prototype);
    }
}
exports.EncodingFailedError = EncodingFailedError;
//# sourceMappingURL=EncodingFailedError.js.map