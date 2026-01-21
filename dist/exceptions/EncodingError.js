"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodingError = void 0;
class EncodingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EncodingError';
        Object.setPrototypeOf(this, EncodingError.prototype);
    }
}
exports.EncodingError = EncodingError;
//# sourceMappingURL=EncodingError.js.map