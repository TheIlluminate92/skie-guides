# Minimize metadata in screenshots submitted to the Empire reader

Tracks #7.

The [image preparation paths](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/assets/empire/detail.js#L27-L61) can retain uploaded bytes. The application [passes the accepted image](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/empire-api/extract.mjs#L53-L61) to the provider. Preserve the existing user consent and minimize source-file metadata beyond the pixels required for extraction.

Consider a bounded, metadata-stripping encode before the provider boundary, with a fail-closed result on unsupported or invalid input. Preserve supported image types, dimensions and readable details, including wide images and their detail views. Use synthetic benign inputs and a fake provider to verify metadata is excluded before dispatch, normal images remain readable, and quota and retirement behavior remain intact. No provider request or live exposure was verified in this review.
