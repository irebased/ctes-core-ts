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
            base: 64
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