# TODO — G 18 Registry Implementation Plan

Step-by-step plan for building the G 18 term-usage registry.

| # | Title | Status |
|---|---|---|
| 02 | [Migrate per-term model](02-migrate-per-term-model.md) | pending |
| 03 | [TC/SC → publication map](03-tc-sc-publication-map.md) | pending |
| 04 | [Browsing UI](04-browsing-ui.md) | pending |
| 05 | [AI consistency check](05-ai-consistency-check.md) | pending |
| 06 | [Initial deployment](06-initial-deployment.md) | pending |

## Step 1 (done already)

Remove G 18 from the vocab concept-browser. Source data preserved.

- PR: [oimlsmart/vocab#41](https://github.com/oimlsmart/vocab/pull/41)
- Branch: `chore/disable-g18`
- Data at `oimlsmart/vocab` `datasets/g18/` is intact (2132 entries)

## Source-of-truth hierarchy

| Layer | Location | Status |
|---|---|---|
| Canonical G 18 data | `oimlsmart/vocab` `datasets/g18/` | existing, intact |
| Bibliography (88 publications) | `oimlsmart/vocab` `datasets/g18/bibliography.yaml` | existing, will gain `tc_sc` field |
| Per-term restructured | `oimlsmart/g18-registry` `data/` | TBD (TODO 02) |
| TC/SC attribution | `oimlsmart/g18-registry` `tc-sc/` | TBD (TODO 03) |
| Browsing UI | `oimlsmart/g18-registry` `docs/` (or similar) | TBD (TODO 04) |
| AI consistency cache | `oimlsmart/g18-registry` `cache/` | TBD (TODO 05) |
| GH Pages site | `https://oimlsmart.github.io/g18-registry/` | TBD (TODO 06) |
