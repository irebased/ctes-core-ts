## Ciphertext Ecosystem Core

This package provides core utilities for the ciphertext ecosystem.

## Functionality

### Ciphertext encoding

Pass a ciphertext object to get back the encoded text:

```ts
function myFunction(ciphertext: Ciphertext) {
    try {
        const encodedData = encode(myCiphertext);
        // ...
    } catch (e) {
        if (e instanceof EncodingError) {
            console.log(`Encoding failed! ${e}`);
        }
    }
}
```

### Ciphertext decoding

Pass a string to the decoder to get back a ciphertext object with the bytes:

```ts
function myFunction(base64String: string) {
    // ...
    try {
        const encodingMd: EncodingMetadata = {
            encoding: Encoding.BASE_CONVERSION,
            base: 64 // supported bases: 2-36 and 64.
        }
        const decodedData: Ciphertext = decode(base64String, encodingMd);
        // ...
    } catch (e) {
        if (e instanceof EncodingError) {
            console.log(`Encoding failed! ${e}`);
        }
    }
}
```

### Ciphertext encoding changes

You can use the `toEncoding` method to change Ciphertext encodings. This is useful
if you have a hex-encoded latin1 string, for example:

```ts
// Specify an encoding using EncodingMetadata
const encodingMd: EncodingMetadata = {
    encoding: Encoding.BASE_CONVERSION,
    base: 16
}

// Create a ciphertext object for a hex string using `decode` method.
// This decodes the hex to a bytestream.
const myHexString: string = "48656c6c6f2c20776f726c6421"
const myCiphertext: Ciphertext = decode(myHexString, encodingMd);

// Convert the Ciphertext to a new encoding.
const targetEncoding: EncodingMetadata = {
    encoding: Encoding.LATIN1,
    base: 0
}
const toLatin1: Ciphertext = toEncoding(myCiphertext, targetEncoding);

// Get the Latin1 string by encoding the ciphertext bytes.
const text = encode(toLatin1);
```