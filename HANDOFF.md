# SKIE site maintenance handoff

OGame Alliance Caretaker owns alliance information and this site by the repository owner’s assignment on 11 November 2026. Historian retains cross-repository documentation and navigation duties. This assignment does not transfer infrastructure ownership.

Prepared release: 1.7.0. SKIE is established on Mars (s268-us). This release implements the owner's Astro Docs presentation preference while retaining the approved world-serpent artwork and navy/cyan/copper theme. Publication completion must be verified separately.

Search is generated from canonical public content into `data/search-index.json` and evaluated locally by `assets/search.js`. Publish the generated index alongside the root HTML. The interface summaries, alliance policy and dated server settings are in `data/content.json`. All existing guide URLs and section anchors remain supported; home `?q=` links forward to search. The cooperation placeholder remains at its existing URL but is not in the main navigation. Discord invitations must remain private.

The content consistency pass follows the framework implementation and is recorded in CONTENT-REVIEW.md. General mechanics review dates remain 9 November 2026. Numerical examples and historical/PTS caveats are retained; this release does not certify a completed feature rollout on Mars.

Validation for the prepared release: build succeeded; 177 baseline, 14 search/layout, 19 Lifeforms, 56 comprehensive and 9 moon-loss checks passed, with updates scope/privacy checks included in the suite. Browser validation covered desktop and phone layout, search results/reset, navigation, updates and table overflow. The approved artwork remains byte-identical. Deployment completion is a separate receipt.

Edit data/content.json for canonical content and scripts/build.mjs for page generation. Build with node scripts/build.mjs and validate with node scripts/test.mjs. For the existing repository-root deployment, publish the generated files from dist/ at the root while retaining the canonical source and build scripts. Do not replace the canonical source JSON with its generated copy containing reading times.

Preserve the approved full world-serpent artwork, general guide evidence dates and historical/PTS caveats. Keep account screenshots, member coordinates, operational rosters, private invitations and chat identifiers out of this public repository. Private alliance administration records are maintained separately.

Recovery: the previous public release is 1.6.3 at c62ee595f26f01367ca3e9337d0a8e2a06c22424. Restore only affected files from a reviewed revision, preserving later unrelated changes. Rebuild and check links before publication. The canonical source, generated search index and browser script must be from the same release.

Updates: maintain `data.updates` with official Mars notices and game changelogs only. Keep announcement date, checked date and deployment status separate. Direct forum and RSS links provide current upstream access; this site does not poll or embed the forum. Do not mix other universes’ maintenance or PTS changes into confirmed Mars notices.
