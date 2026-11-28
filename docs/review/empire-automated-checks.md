# Run the existing Empire card and reader checks on pull requests

Tracks #9.

The [guide verification workflow](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/.github/workflows/verify-guide.yml#L13-L23) runs the static build and guide suite. The [deployment guide](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/DOCKER.md#L15-L25) documents a distinct `node --test empire-api/test.mjs` command. [The existing suite](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/empire-api/test.mjs) covers field math and expiry along with API, validation and quota behavior.

Run the existing isolated suite in Node 24 without credentials or network access to the provider. Expose a clear PR check result and retain read-only workflow permissions. No tests were rerun during this review.
