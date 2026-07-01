# G 18 — OIML Term-Usage Registry

**A usage registry, not a vocabulary.** G 18 collates the instances where a term is used across OIML Recommendations and Documents, with each instance's definition and a consistency check against the official VIM/VIML definition.

## Why a separate project

G 18 is structurally different from VIM/VIML:

- **VIM/VIML** = *authoritative concept definitions* (the source of truth)
- **G 18** = *observation registry* (where terms appear, with what definition)

The data lives in [`oimlsmart/vocab` `datasets/g18/`](https://github.com/oimlsmart/vocab/tree/main/datasets/g18/) (2132 entries, 1207 unique terms, 287 with multiple publication instances). This repo consumes that data and renders it as a term-usage registry, separate from the vocab concept-browser.

## Use cases (per OIML TC 1 / Vocabularies)

- **TC editor**: identify which terms in your Recommendation diverge from the official VIM/VIML definition.
- **TC chair**: see which TC/SC has the most drift from official vocabulary.
- **Authoring a new Recommendation**: search for a term; if it's in VIM/VIML, get the official definition; if it's already in G 18 from other Recs, see how others defined it; pick the most authoritative.
- **OIML secretariat**: maintain a consistency dashboard across all Recommendations.

## Status

**Pre-implementation.** Source data is intact in the vocab repo. Migration steps 1–6 are tracked in `TODO/`:

| # | Title | Status |
|---|---|---|
| 02 | Convert `datasets/g18/` to per-term model with multiple publication instances | pending |
| 03 | Build TC/SC → publication map (need OIML org data) | pending |
| 04 | Build browsing UI (per-term / per-TC / per-publication views) | pending |
| 05 | AI consistency check (official vs publication definitions) | pending |
| 06 | Initial deployment via GitHub Pages | pending |

Step 1 (removing G 18 from the vocab concept-browser) was done in [`oimlsmart/vocab#41`](https://github.com/oimlsmart/vocab/pull/41). The G 18 *data* remains in that repo as the canonical source.

## Architecture

```
oimlsmart/vocab         (existing)
  └─ datasets/g18/        ← canonical source data, NOT to be deleted
        │
        │ consumed by migration script
        ▼
oimlsmart/g18-registry  (this repo)
  ├─ TODO/                ← step-by-step plan
  ├─ data/                 ← per-term model: one file per unique term
  ├─ tc-sc/                ← TC/SC attribution
  └─ docs/                 ← browsing UI (TBD)
```

URN cross-references to VIM/VIML stay the same: `urn:oiml:pub:v:1:2022`, `urn:oiml:pub:v:2:1993`, etc. G 18 entries link to VIM/VIML via `related: - type: see` edges.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` (TBD). Until then, this README is the only thing live on the Pages URL.

## Related

- Issue: [oimlsmart/vocab#42 — G 18 future direction](https://github.com/oimlsmart/vocab/issues/42)
- Source data: [`oimlsmart/vocab` `datasets/g18/`](https://github.com/oimlsmart/vocab/tree/main/datasets/g18/)
