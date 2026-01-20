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