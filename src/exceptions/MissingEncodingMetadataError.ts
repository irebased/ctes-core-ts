import { EncodingError } from "./EncodingError";

export class MissingEncodingMetadataError extends EncodingError {
  constructor(message: string) {
    super(message);
    this.name = 'MissingEncodingMetadataError';
    Object.setPrototypeOf(this, MissingEncodingMetadataError.prototype);
  }
}