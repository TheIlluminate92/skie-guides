# Skie Field Manual 1.5.0

A static, guide-first OGame reference site. The manual is prepared for its dedicated `TheIlluminate92/skie-guides` repository. It does not modify the original Project Orion site.

## Contents

- An essentials guide and eight mechanics overviews: economy, power, crawlers, fleetsaving, colonies, research, expeditions and lifeforms.
- Six linked Lifeforms references: population/unlock builds, four species tables containing all 72 research entries, and shared stacking/caps guidance. The Lifeforms overview stays concise; detailed pages are searchable and grouped under it rather than treated as core chapters.
- A Special buildings area with four guides: obtaining and developing moons; jump gates and sensor phalanx; nanites and missile silos; and Orion scanner builds and rewards.
- A separate Defense guide with planning, repair, missile and multi-wave edge cases.
- Three separate play-style paths: miner, expedition and active fleet.
- An Orion merge-preparation guide with a first-build sequence, balanced IAS network table, dated unlock checkpoints, observed possible mission rewards and a conditional IAS-to-mission-level range, and the preserved historical IAS cost calculator.
- Glossary, alliance information and a clearly undetermined alliance-cooperation section. Specialist guides link to related guides rather than assuming that one building or defense ratio solves every problem.
- A chapter menu, page contents, full-text library search, quick checks, local reading progress, print styling and plain-text downloads.

All guide prose is pre-rendered HTML. Reading and ordinary links work without JavaScript. Search, optional progress, copy and the historical calculator are progressive enhancements. No analytics, remote fonts, game integration, account login or automatic message sending is included. Reading progress uses only browser localStorage.

## Source and build

`data/content.json` is the canonical guide source. `assets/style.css`, `assets/app.js` and `assets/costs.js` implement the presentation and enhancements. `scripts/build.mjs` generates the static pages and text downloads into `dist/`. Do not hand-edit generated guide pages.

Run with a modern Node.js runtime:

    node scripts/build.mjs
    node scripts/test.mjs

No dependencies or package installation are needed. Serve `dist/` using a static server. Publish the generated `dist/` directory at the dedicated site root. Retain the canonical source JSON, assets, build and test scripts and this README in the source repository. Do not publish legacy assembly inputs or publication receipts.

## Evidence

Core mechanics are linked per guide and retain their 8 November 2026 review date. The Orion and Lifeforms guides were separately reviewed on 9 November 2026. The Lifeforms research data is checked against Gameforge’s 2023 workbook and pinned Tracker definitions; known current-version conflicts are explicit. Historical official references are labelled as such. Numerical examples state their assumptions; they are not personal account screenshots or current universal build prescriptions. The fusion comparison proves output and field efficiency, not equal-cost superiority. Crawler cap evidence includes explicitly labelled PTS patch history. See `PROVENANCE.md`.

## Release and recovery

Version 1.5.0 adds the linked Lifeforms reference collection. It preserves every existing non-Lifeforms guide and all alliance facts byte-for-byte at the source-record level from 1.4.0, including Orion’s reward observations and conditional IAS ranges. The approved artwork, calculator and interaction script remain unchanged. Navigation and section rendering now support grouped reference children and linked reference cards. New styles use the existing theme. Tests check all 72 rendered and downloadable research rows, all 24 population milestones, links, version caveats, no ordinary Lifeform fields and the preserved behavior. No complete re-audit of unrelated current live mechanics is claimed.

The population builds are cost-oriented endpoints under a reproducible equilibrium model, not universal optimal builds or exact chronological purchase plans. Costs exclude stated prerequisites, normal power, technologies and artefacts. Rock’tal’s discounted historical model is not passed off as an exact from-zero bill. Current population must actually reach a slot threshold; very narrow final margins are disclosed. Fuel reduction retains the distinction between the older 30% Lifeform definition and the later 90% global limit, with the combined live formula unverified.

The Orion guide does not certify the activation flag of a merge target. Its 15-planet construction example uses the dated beta13 model. Its reward table contains selected possible per-mission observations, including approximately 1.415 billion raw Metal + Crystal + Deuterium at card-visible mission level 658 with separately reported total IAS 693. Selected scan levels remain unknown. About ±20% variation applies around the selected scan level, which equals total IAS only at the maximum setting. No global reward curve, expected yield, current quote or daily income is inferred from the selected cards. Raw resource sums are not Metal-equivalent value or net profit. Current Techinfo and mission reports take precedence.

For the existing repository-root Pages deployment, flatten the generated `dist/` files at the root, retain `assets/`, `scripts/` and `package.json`, and use the canonical source `data/content.json` rather than the generated copy containing calculated reading times. The browser does not fetch the JSON. Rebuilding from this root must reproduce the public pages and pass the self-contained tests. Do not publish local review notes, screenshots or release receipts. No original Orion project file is modified.

## License

Project Orion's MIT notice is preserved in `LICENSE-ORION`. Decorative artwork and site layout are original. OGame and its trademarks belong to their respective owners; this is an independent alliance guide.

## Visual identity

The full, user-approved world-serpent artwork is `assets/skie-alliance-world-serpent.png`. It is copied without pixel edits or re-encoding; its SHA-256 is `38359219351b7d7ead08e50a1200493ae19e26b080b673d1512a4be485e7eecb`. Use the deployed `/assets/skie-alliance-world-serpent.png` path for the stable alliance logo URL. The responsive image keeps its entire 1944 × 809 composition visible on phones and desktops.

The interface uses guide, reference and review language rather than tutorial or lesson framing. The theme uses cosmic navy reading surfaces, luminous cyan controls, warm copper details and low-contrast abstract circuit lines. No mythology narrative is added to the guides. Reading, chapters, search, quick checks, local progress, historical calculations, copying, downloads and printing keep the same behavior.

## Extending the reference library

Guide records may use `kind: "reference"` and `parent` to link a detailed reference to an overview. The generator renders those children in the parent section’s navigation, includes them in full-text library search, and gives each a normal HTML page and text download. A section’s `links` array contains a guide ID, optional section anchor, title and description. The builder validates IDs and the test suite resolves every local anchor. Add future verified building references through this structure; no empty building-table placeholders are generated.
