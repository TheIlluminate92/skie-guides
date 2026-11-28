# Make the historical calculator integrity check portable

Tracks #8.

The saved [Windows handoff](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/HANDOFF.md#L3-L8) reports an existing IAS checksum failure. [The verification code](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/scripts/test.mjs#L38-L50) hashes raw bytes against a fixed [fixture digest](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/scripts/theme-fixture.mjs#L5). The Git blob matches the fixture digest. Converting those bytes to CRLF produces a different digest without changing calculator logic. There is no repository line-ending rule for the file. The original failing checksum was unavailable, so confirm attribution on Windows.

Preserve the protected calculator bytes. Establish an explicit repository byte policy or a clearly scoped canonicalization for that check. Verify the same intended source on Windows and Linux, and verify the check still rejects a real content change. Ubuntu PR verification passed at the same tree as the reviewed main. No suite ran in this review.
