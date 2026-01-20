import { EncodingError } from "./EncodingError";

export class InvalidEncodingError extends EncodingError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEncodingError';
    Object.setPrototypeOf(this, InvalidEncodingError.prototype);
  }
}