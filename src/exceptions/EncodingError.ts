export class EncodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EncodingError';
    Object.setPrototypeOf(this, EncodingError.prototype);
  }
}