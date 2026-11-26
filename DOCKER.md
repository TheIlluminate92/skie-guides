## Run the SKIE Field Manual

Download `skie-guides-linux-amd64.tar.gz` and `SHA256SUMS` from this release into the same folder. On a Linux x86-64 Docker host:

```sh
sha256sum -c SHA256SUMS
docker load -i skie-guides-linux-amd64.tar.gz
docker run -d --name skie-guide-preview -p 127.0.0.1:8895:8080 skie-guides:1.8.0-rc.1
```

Open http://127.0.0.1:8895/ on the Docker host. The container serves the guide on port 8080 as an unprivileged user. It needs no database, volumes, game credentials or access to other containers. The loopback binding is for local review. Remove the preview with `docker rm -f skie-guide-preview`.

To build from source, run `node scripts/build.mjs`, `node scripts/test.mjs`, then `docker build -t skie-guides:1.8.0-rc.1 .`. The release archive preserves the exact built image.
