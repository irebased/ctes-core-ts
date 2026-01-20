import { EncodingError } from "./EncodingError";

export class EncodingFailedError extends EncodingError {
  constructor(message: string) {
    super(message);
    this.name = 'EncodingFailedError';
    Object.setPrototypeOf(this, EncodingFailedError.prototype);
  }
}