# Skie Field Manual 1.2.0

A static, guide-first OGame reference site. The manual is prepared for its dedicated `TheIlluminate92/skie-guides` repository. It does not modify the original Project Orion site.

## Contents

- An essentials guide and eight mechanics guides: economy, power, crawlers, fleetsaving, colonies, research, expeditions and lifeforms.
- A Special buildings area with three guides: obtaining and developing moons; jump gates and sensor phalanx; nanites and missile silos.
- A separate Defense guide with planning, repair, missile and multi-wave edge cases.
- Three separate play-style paths: miner, expedition and active fleet.
- A separately labelled historical Orion/PTS reference and exact IAS cost calculator.
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

Mechanics are linked per guide and reviewed 8 November 2026. Historical official references are labelled as such. Numerical examples state their assumptions; they are not personal account screenshots or current universal build prescriptions. The fusion comparison proves output and field efficiency, not equal-cost superiority. Crawler cap evidence includes explicitly labelled PTS patch history. See `PROVENANCE.md`.

## Recovery

The expanded 1.1.0 guide corpus is preserved in `data/content.json`, with only the starter title and its navigation label adjusted to restore the approved reference-guide tone. Presentation version 1.2.0 applies the theme and logo alongside the restored guide labels; the source review date and guide downloads retain their original content version. `scripts/theme-fixture.mjs` records the content, interaction and artwork hashes. No original Orion file is part of this redesign.

## License

Project Orion's MIT notice is preserved in `LICENSE-ORION`. Decorative artwork and site layout are original. OGame and its trademarks belong to their respective owners; this is an independent alliance guide.

## Visual identity

The full, user-approved world-serpent artwork is `assets/skie-alliance-world-serpent.png`. It is copied without pixel edits or re-encoding; its SHA-256 is `38359219351b7d7ead08e50a1200493ae19e26b080b673d1512a4be485e7eecb`. Use the deployed `/assets/skie-alliance-world-serpent.png` path for the stable alliance logo URL. The responsive image keeps its entire 1944 × 809 composition visible on phones and desktops.

The interface uses guide, reference and review language rather than tutorial or lesson framing. The theme uses cosmic navy reading surfaces, luminous cyan controls, warm copper details and low-contrast abstract circuit lines. No mythology narrative is added to the guides. Reading, chapters, search, quick checks, local progress, historical calculations, copying, downloads and printing keep the same behavior.
