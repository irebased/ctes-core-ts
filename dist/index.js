"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodingFailedError = exports.InvalidEncodingError = exports.MissingEncodingMetadataError = exports.getEncodingName = exports.decode = exports.encode = void 0;
const encoding_1 = require("./encoding");
Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return encoding_1.decode; } });
Object.defineProperty(exports, "encode", { enumerable: true, get: function () { return encoding_1.encode; } });
Object.defineProperty(exports, "getEncodingName", { enumerable: true, get: function () { return encoding_1.getEncodingName; } });
const exceptions_1 = require("./exceptions");
Object.defineProperty(exports, "MissingEncodingMetadataError", { enumerable: true, get: function () { return exceptions_1.MissingEncodingMetadataError; } });
Object.defineProperty(exports, "InvalidEncodingError", { enumerable: true, get: function () { return exceptions_1.InvalidEncodingError; } });
Object.defineProperty(exports, "EncodingFailedError", { enumerable: true, get: function () { return exceptions_1.EncodingFailedError; } });
//# sourceMappingURL=index.js.map