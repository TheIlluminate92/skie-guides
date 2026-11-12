# SKIE site maintenance handoff

OGame Alliance Caretaker owns alliance information and this site by the repository owner’s assignment on 11 November 2026. Historian retains cross-repository documentation and navigation duties. This assignment does not transfer infrastructure ownership.

Current release: 1.6.3. The alliance owner confirmed the merge complete on 11 November 2026. SKIE is established on Mars (s268-us).

Edit data/content.json for canonical content and scripts/build.mjs for page generation. Build with node scripts/build.mjs and validate with node scripts/test.mjs. For the existing repository-root deployment, publish the generated files from dist/ at the root while retaining the canonical source and build scripts. Do not replace the canonical source JSON with its generated copy containing reading times.

Preserve the approved full world-serpent artwork, general guide evidence dates and historical/PTS caveats. Keep account screenshots, member coordinates, operational rosters, private invitations and chat identifiers out of this public repository. Private alliance administration records are maintained separately.

Recovery: the previous public release is 1.6.2 at 774244ad3985d2c840800a67c3d017e05871fb62. Restore only affected files from a reviewed revision, preserving later unrelated changes. Rebuild and check links before publication.
