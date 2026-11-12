# Skie Field Manual 1.7.0

<!-- reader-guide:start -->
## Meet the project

A guide-first OGame field manual for alliance members: learn the essentials, follow practical paths and look up detailed mechanics without reading the whole site. Maintainers edit canonical content and generate the public pages.

### What it is built with

Dependency-free JavaScript ES modules for Node.js build/tests and browser enhancements, JSON content, HTML and CSS. GitHub Pages serves the output. Astro inspired the layout; Astro, React and Vue are not installed frameworks.

### Find your way around

| Start here | What you will find |
|---|---|
| [data/content.json](data/content.json) | Canonical prose, evidence and dated public alliance information. |
| [scripts/build.mjs](scripts/build.mjs) | Build pages, downloads and search index. |
| [assets/search.js](assets/search.js) | Local search matching and ranking. |
| [CONTENT-REVIEW.md](CONTENT-REVIEW.md) | What was reviewed and what remains uncertain. |
| [HANDOFF.md](HANDOFF.md) | Maintenance and publication handoff. |

### When something goes wrong

Start by reading the relevant source or guide below. These are investigation
starting points, not instructions to change a live system.

| Symptom or question | First place to look |
|---|---|
| Wrong guide text | Edit its canonical content record; changing generated HTML alone will be lost on rebuild. |
| Search missing or stale | Compare the search index and assets with the same build manifest. |
| Unsure whether a game change is live | Read its date/status and original source; a planned announcement is not confirmed deployment. |

The alliance caretaker maintains the public manual and its source; private alliance records remain separate.

Reader guide reviewed November 12, 2026 against repository source and available
owner records. Existing test, deployment and recovery evidence keeps its original
date; this prose review did not run the application or test a restore.
<!-- reader-guide:end -->

Version 1.7.0 adopts a compact documentation layout while preserving the approved SKIE world-serpent image and navy, cyan and copper identity. Persistent search covers every guide, path, section, glossary entry and public alliance reference. Topic navigation expands independently; practical summaries precede article detail. Mars settings and alliance policy are dated separately from mechanics evidence. See [CONTENT-REVIEW.md](CONTENT-REVIEW.md) for this release's content pass and verification limits.

OGame updates cover US Mars notices and official changelogs, with direct announcement, live-server changelog and RSS links. Selected summaries are maintained with releases and show their checked date; the site does not automatically poll the forum.

A static, guide-first OGame reference site. The manual is prepared for its dedicated `TheIlluminate92/skie-guides` repository. It does not modify the original Project Orion site.

## Contents

- An essentials guide and eight mechanics overviews: economy, power, crawlers, fleetsaving, colonies, research, expeditions and lifeforms.
- Eleven linked mechanics references cover economic returns, power, colonies, classic research, crawlers, fleetsaving, expeditions, moonshots, moon networks, facilities/missiles and defense comparisons. Main topic pages stay concise, while complete mechanics tables, formulas and worked examples remain on the detailed pages.
- Six linked Lifeforms references: population/unlock builds, four species tables containing all 72 research entries, and shared stacking/caps guidance. The Lifeforms overview stays concise; detailed pages are searchable and grouped under it rather than treated as core chapters.
- A Special buildings area with four guides: obtaining and developing moons; jump gates and sensor phalanx; nanites and missile silos; and Orion scanner builds and rewards.
- A separate Defense guide with planning, repair, missile and multi-wave edge cases.
- Three separate play-style paths: miner, expedition and active fleet.
- An Orion planning guide with a conditional first-build sequence, balanced IAS network table, dated unlock checkpoints, observed possible mission rewards and the preserved historical IAS calculator. The source review date is unchanged; activation must be confirmed in game.
- Glossary, factual alliance information and dated US Mars settings. The undetermined cooperation URL is retained but omitted from prominent navigation.
- Expandable topic navigation, page contents, word-based section search with excerpts and scope filters, quick checks, local reading progress, print styling and plain-text downloads.

All guide prose is pre-rendered HTML. Reading and ordinary links work without JavaScript. Search, optional progress, copy and the historical calculator are progressive enhancements. No analytics, remote fonts, game integration, account login or automatic message sending is included. Reading progress uses only browser localStorage.

## Source and build

`data/content.json` is the canonical guide, alliance, server and practical-summary source. `assets/style.css`, `assets/app.js`, `assets/search.js` and `assets/costs.js` implement the presentation and enhancements. `scripts/build.mjs` generates pages, text downloads and `data/search-index.json` into `dist/`. Do not hand-edit generated pages or the search index.

Run with a modern Node.js runtime:

    node scripts/build.mjs
    node scripts/test.mjs

No dependencies or package installation are needed. Serve `dist/` using a static server. Publish the generated `dist/` directory at the dedicated site root. Retain the canonical source JSON, assets, build and test scripts and this README in the source repository. Do not publish legacy assembly inputs or publication receipts.

## Evidence

All guide domains were reviewed on 9 November 2026. Source age and environment remain explicit: the review date is not the date a game mechanic changed and is not a claim of live-account inspection. The Lifeforms research data is checked against Gameforge’s 2023 workbook and pinned Tracker definitions; known current-version conflicts are explicit. Historical official references are labelled as such. Numerical examples state their assumptions; they are not personal account screenshots or current universal build prescriptions. The fusion comparison proves output and field efficiency, not equal-cost superiority. Crawler cap evidence includes explicitly labelled PTS patch history. See `PROVENANCE.md`.

## Ownership and upkeep

OGame Alliance Caretaker owns alliance information and this site, assigned by the repository owner on 11 November 2026. Historian maintains cross-repository documentation and navigation. See [the maintenance handoff](HANDOFF.md) and [dated changes](CHANGELOG.md).

## Release and recovery

Version 1.6.3 records the alliance owner’s confirmation on 11 November 2026 that the merge is complete and SKIE is established on Mars (s268-us). The canonical alliance status and generated alliance page now agree. This update does not change guide mechanics, their 9 November review date, artwork, styles or interaction behavior.

Version 1.6.2 confirms Mars as the official SKIE migration destination, as confirmed by alliance leadership on 10 November 2026. Migration timing and instructions remain with leadership. This destination decision does not establish server settings or Orion activation; all guide mechanics, source review dates and approved assets remain unchanged from 1.6.1.

Version 1.6.1 adds a source-dated moon-loss caveat and a link from the moon-network reference. A 22 September 2021 staff reply described a same-coordinate Deployment automatically returning after its destination moon was destroyed. Live 12.0.36, released 27 March 2025, later fixed moon-loss Deployment visibility, but its notes do not identify that exact case. Current behavior remains unverified; automatic returns must not be assumed to share player-recall treatment. All other guide records, ordinary visibility matrices, beginner overviews, artwork, styles and JavaScript remain unchanged from 1.6.0.

Version 1.6.0 integrates a complete guide review with eleven new detailed mechanics pages, concise topic overviews and stronger comparisons for all three play styles. Thirty-four guide records generate thirty-nine HTML pages and thirty-four plain-text downloads. Existing guide URLs and their section anchors remain useful; longer explanations move to linked references instead of being removed. The seven Lifeforms records and Orion evidence remain preserved from the corrected 1.5.0 source, alongside the approved artwork, style, interaction script and historical calculator. The population construction-gate labels correctly distinguish available population from trained tiers.

The full self-contained tests check public links and anchors, HTML/text parity, source boundaries, schema, table arithmetic, all 72 Lifeform technologies, all 24 population milestones, exact artwork and behavior preservation, and build packaging. Calculated examples and source checks do not reproduce the live combat engine. Browser checks, when performed, are reported separately from these automated checks.

The population builds are cost-oriented endpoints under a reproducible equilibrium model, not universal optimal builds or exact chronological purchase plans. Costs exclude stated prerequisites, normal power, technologies and artefacts. Rock’tal’s discounted historical model is not passed off as an exact from-zero bill. Current population must actually reach a slot threshold; very narrow final margins are disclosed. Fuel reduction retains the distinction between the older 30% Lifeform definition and the later 90% global limit, with the combined live formula unverified.

The Orion guide does not certify the activation flag of a merge target. Its 15-planet construction example uses the dated beta13 model. Its reward table contains selected possible per-mission observations, including approximately 1.415 billion raw Metal + Crystal + Deuterium at card-visible mission level 658 with separately reported total IAS 693. Selected scan levels remain unknown. About ±20% variation applies around the selected scan level, which equals total IAS only at the maximum setting. No global reward curve, expected yield, current quote or daily income is inferred from the selected cards. Raw resource sums are not Metal-equivalent value or net profit. Current Techinfo and mission reports take precedence.

For the existing repository-root Pages deployment, flatten the generated `dist/` files at the root, retain `assets/`, `scripts/` and `package.json`, and use the canonical source `data/content.json` rather than the generated copy containing calculated reading times. Publish the generated `data/search-index.json`; the browser fetches that public index for search, not the canonical content file. Rebuilding from this root must reproduce the public pages and pass the self-contained tests. Do not publish private review notes, screenshots or release receipts. No original Orion project file is modified.

## License

Project Orion's MIT notice is preserved in `LICENSE-ORION`. Decorative artwork and site layout are original. OGame and its trademarks belong to their respective owners; this is an independent alliance guide.

## Visual identity

The full, user-approved world-serpent artwork is `assets/skie-alliance-world-serpent.png`. It is copied without pixel edits or re-encoding; its SHA-256 is `38359219351b7d7ead08e50a1200493ae19e26b080b673d1512a4be485e7eecb`. Use the deployed `/assets/skie-alliance-world-serpent.png` path for the stable alliance logo URL. The responsive image keeps its entire 1944 × 809 composition visible on phones and desktops.

The interface uses guide, reference and review language rather than tutorial or lesson framing. The theme uses cosmic navy reading surfaces, luminous cyan controls, warm copper details and low-contrast abstract circuit lines. No mythology narrative is added to the guides. Version 1.7.0 improves navigation and search while retaining reading checks, local progress, historical calculations, copying, downloads and printing.

## Extending the reference library

Guide records may use `kind: "reference"` and `parent` to link a detailed reference to an overview. The generator groups those children in expandable topic navigation, indexes every section for search, and gives each a normal HTML page and text download. A section’s `links` array contains a guide ID, optional section anchor, title and description. The builder validates IDs and the test suite resolves every local anchor. Add future verified building references through this structure and provide a short `interface.answers` entry; no empty building-table placeholders are generated.
