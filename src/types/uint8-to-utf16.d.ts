declare module "uint8-to-utf16" {
  export function encode(bytes: Uint8Array): string;
  export function decode(text: string): Uint8Array;
}

