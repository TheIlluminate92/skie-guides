## Run the SKIE Field Manual

Download `skie-guides-linux-amd64.tar.gz` and `SHA256SUMS` from this release into the same folder. On a Linux x86-64 Docker host:

```sh
sha256sum -c SHA256SUMS
docker load -i skie-guides-linux-amd64.tar.gz
docker run -d --name skie-guide-preview -p 127.0.0.1:8895:8080 skie-guides:1.8.0-rc.2
```

Open http://127.0.0.1:8895/ on the Docker host. The container serves the guide on port 8080 as an unprivileged user. It needs no database, volumes, game credentials or access to other containers. The loopback binding is for local review. Remove the preview with `docker rm -f skie-guide-preview`.

To build from source, run `node scripts/build.mjs`, `node scripts/test.mjs`, then `docker build -t skie-guides:1.8.0-rc.2 .`. The release archive preserves the exact built image.

## Temporary Empire field card

The static guide includes the manual editor and PNG export. The optional private API sidecar receives only explicit screenshot uploads. Use Node 24 (includes SQLite) or build the sidecar from the repository root with:

    docker build -f empire-api/Dockerfile -t skie-empire-reader:review .
    node --test empire-api/test.mjs

Set the exact public HTTPS origin in EMPIRE_PUBLIC_ORIGIN. Mount the dedicated project key read-only and set OPENAI_API_KEY_FILE to its in-container path. OPENAI_API_KEY is supported for local development. Set EMPIRE_QUOTA_DB to a file on persistent storage writable by the service user. Use one shared database and one service instance for the release. The default global limit is 20 requests per UTC day and SKIE sets EMPIRE_DAILY_LIMIT=100. The service also allows 3 paid reads per visitor IP per UTC day, 3 requests across the site per minute, and 2 concurrent requests. SQLite reserves all three allowances in one transaction after upload validation. The visitor allowance uses canonical IPs and keyed daily hashes in the same protected database. The database stores no raw visitor IPs. The first accepted reservation on a new UTC day clears the previous day’s visitor rows. Upgrading an existing database preserves the shared counts already used that day. The reader enforces a 55-second request deadline, cancels provider calls on disconnect and limits provider responses to 256 KiB. The app reserves a request before provider dispatch and counts ambiguous requests against the allowance. These limits bound accepted calls and do not set a monetary billing limit.

Forward only POST /api/empire/extract from the guide origin to private service port 8081. Set EMPIRE_TRUSTED_PROXY_IP to the exact socket peer address the sidecar sees for that proxy. The proxy must overwrite X-SKIE-Client-IP with a single visitor address from its verified ingress. Omit the header if the ingress cannot verify it. Strip any client-provided copy, including on alternate ingress paths. Verify both the proxy peer and the visitor identity through the exact private route before switching the sidecar. The API returns an unavailable response without a verified visitor IP. Preserve the Origin header, allow up to 6 MiB request bodies and 60 seconds for the response. Disable proxy request-body logging, disk buffering and caching on that route. The application sends the consented image to OpenAI with store:false, returns only colony rows, and keeps quota counters and their local hashing key on disk. The editor exposes the full screenshot to the provider, so ask players to crop before sending. The reader uses GPT-5.4 nano for a single image. For wide panoramas, the browser prepares overlapping enlarged detail panels. The original or a re-encoded overview and its panels travel together under the existing 6 MiB limit; one request to GPT-4.1 mini consumes one quota reservation. Deploy the compatible API before the static editor. The new API still accepts earlier PNG/JPEG uploads. The image never goes in the static site's tree. A static-only install supports manual export.

The entry links and editor expire at 2026-12-26T18:00:00Z. The API replies 410 before reading the body or dispatching a new provider request at or after the cutoff. At retirement unlink and remove the card assets, remove only its proxy route and sidecar, and revoke the dedicated key. Preserve the rest of the Orion guide. Removing the optional route or stopping the sidecar immediately disables paid processing while preserving manual entry during the release window.
