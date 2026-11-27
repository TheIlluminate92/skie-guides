# SKIE site maintenance handoff

November 27 reader-guide refresh for PR #1. The README adds troubleshooting
for stale search, generated content and publication identity to the current
1.8.0 guide. The build and link-target checks passed. The guide tests stop at
the historical IAS calculator checksum already present on unchanged `main`
`dabf635`. Pages publication remains pending exact review and approval.

November 26 visitor allowance source candidate. The screenshot API reserves up
to three paid reads per verified visitor IP per UTC day alongside the existing
shared caps. The change preserves existing shared SQLite counters and stores
keyed daily visitor hashes. The site operator needs to qualify the exact trusted
proxy peer and its verified visitor header before rollout. All 12 API tests
passed with a mock provider, and the static guide built. The full guide test
stops at the same IAS calculator hash mismatch on the unchanged starting
revision. See [the deployment guide](DOCKER.md#temporary-empire-field-card).

November 26 Empire-only candidate. Uses the prior 895d1ce guide content, adds the temporary Empire card, and uses GPT-5.4 nano. A live synthetic vision check matched both names and all six numbers. Erik approved public screenshot reading with a shared limit of 100 requests per UTC day and existing per-minute and concurrency limits. R730 serves the Empire-only static build as of November 26 at 11:53 CST. The screenshot reader image passed isolated Docker tests and awaits public routing acceptance.

November 26 local review. The temporary Empire field card is available from the local Orion guide and Player tools. Editable values and PNG export run in the browser. Screenshot reading uses an optional separately deployed same-origin API and requires consent. Synthetic API, quota, field math, expiry and Chromium PNG checks passed. A live OpenAI test used a synthetic image. Public upload routing is pending. The tool retires December 26, 2026 at noon Central. Keep the Orion guide through retirement.

26 November follow-up for review on the deployed 1.8.0 source. The Lifeforms overview, stacking reference and starter guide include the FAQ, five historical player build profiles and hidden achievement clues. Player-reported thresholds and conflicting accounts are labeled in the guide. The public cutover is recorded separately by Operations. Erik authorized the repository push on November 26. This content follow-up was excluded from the earlier Empire-only R730 build.

Current local candidate: 1.8.0, 26 November 2026. Erik reviews the active alliance manual before publication. The prior 1.7.0 handoff below documents the published baseline. Verify Mars activation, the actual field change on release day.

OGame Alliance Caretaker owns alliance information and this site by the repository owner’s assignment on 11 November 2026. Historian retains cross-repository documentation and navigation duties. This assignment does not transfer infrastructure ownership.

Prepared release: 1.7.0. SKIE is established on Mars (s268-us). This release implements the owner's Astro Docs presentation preference while retaining the approved world-serpent artwork and navy/cyan/copper theme. Publication completion must be verified separately.

Search is generated from canonical public content into `data/search-index.json` and evaluated locally by `assets/search.js`. Publish the generated index alongside the root HTML. The interface summaries, alliance policy and dated server settings are in `data/content.json`. All existing guide URLs and section anchors remain supported; home `?q=` links forward to search. The cooperation placeholder remains at its existing URL but is not in the main navigation. Discord invitations must remain private.

The content consistency pass follows the framework implementation and is recorded in CONTENT-REVIEW.md. General mechanics review dates remain 9 November 2026. Numerical examples and historical/PTS caveats are retained; this release does not certify a completed feature rollout on Mars.

Validation for the prepared release: build succeeded; 177 baseline, 14 search/layout, 19 Lifeforms, 56 comprehensive and 9 moon-loss checks passed, with updates scope/privacy checks included in the suite. Browser validation covered desktop and phone layout, search results/reset, navigation, updates and table overflow. The approved artwork remains byte-identical. Deployment completion is a separate receipt.

Edit data/content.json for canonical content and scripts/build.mjs for page generation. Build with node scripts/build.mjs and validate with node scripts/test.mjs. For the existing repository-root deployment, publish the generated files from dist/ at the root while retaining the canonical source and build scripts. Do not replace the canonical source JSON with its generated copy containing reading times.

Preserve the approved full world-serpent artwork, general guide evidence dates and historical/PTS caveats. Keep account screenshots, member coordinates, operational rosters, private invitations and chat identifiers out of this public repository. Private alliance administration records are maintained separately.

Recovery: the previous public release is 1.6.3 at c62ee595f26f01367ca3e9337d0a8e2a06c22424. Restore only affected files from a reviewed revision, preserving later unrelated changes. Rebuild and check links before publication. The canonical source, generated search index and browser script must be from the same release.

Updates: maintain `data.updates` with official Mars notices and game changelogs only. Keep announcement date, checked date and deployment status separate. Direct forum and RSS links provide current upstream access; this site does not poll or embed the forum. Do not mix other universes’ maintenance or PTS changes into confirmed Mars notices.
Current review additions include a verified public Starforge Atlas destination and a local-only browser calculator for Lithium scan and claim costs.
Game promotions are unpaid editorial links in gamePromos in scripts/build.mjs. Affiliate enrollment and live publication remain separate.
Docker review downloads use docker-v tags and a GitHub prerelease. The Pages source is main. See DOCKER.md for local installation.

The temporary card uses a November 26 Gameforge lobby snapshot of 267 open universes. Selection resolves the community-specific field bonus automatically. Values from 10 to 70 are universe-specific. Existing Orion universes opened November 6 already include their changes, and unknown pre-release baselines produce a partial card. No player-supplied XML or background collector is used.

November 26 wide screenshot reader candidate. Low-resolution header field pairs beside coordinates and the separate Facilities / Terraformer row are explicit in the model prompt. Synthetic panorama tests cover one upload, bounded framing, one quota reservation and model routing. Chromium tested the actual three enlarged details and overview on synthetic data. Private screenshots are excluded from testing and publication. Host and end-user acceptance remain separate.

Wide-image acceptance, November 26. Chromium produced one upload from a synthetic 17-colony Empire View. GPT-4.1 mini returned all 17 names and each used, total and Terraformer value in order. No owner screenshot was sent during this verification.
