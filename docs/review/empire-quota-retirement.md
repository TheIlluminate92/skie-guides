# Document quota data disposition at Empire reader retirement

Tracks #10.

The visitor ledger [retires historical rows when it reserves quota](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/empire-api/extract.mjs#L90-L127). Once paid processing ends, a new accepted reservation no longer triggers that cleanup. The documented [retirement steps](https://github.com/TheIlluminate92/skie-guides/blob/6ae893ef564f6f8945541ccccfbde52319144415/DOCKER.md#L24-L27) cover the editor, route, sidecar and dedicated API key. They leave the ledger and its pseudonymization key disposition unspecified.

Have the owner record the authorized retention window, accountable owner and verified disposition for the ledger, hashing key and applicable protected backups. Preserve shared counters through rollback while service is active. Validate the procedure using only a disposable synthetic ledger. No live data or backups were read, changed or removed.
