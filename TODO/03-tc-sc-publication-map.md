# 03 — Build TC/SC → publication map

## Problem

G 18 entries cite 88 OIML publications (Recommendations, Documents).
For consistency analysis and per-TC/SC views, we need to know **which
TC/SC owns each publication**.

Currently in `oimlsmart/vocab` `datasets/g18/bibliography.yaml`:
- `id`: machine-lookup key (e.g. `OIML B003:2003`)
- `reference`: display form (e.g. `OIML B 3:2003`)
- `link`: PDF URL

Missing: `tc_sc` field (e.g. `TC 9/SC 1`).

## What needs to happen

1. Add a `tc_sc` field to every entry in `oimlsmart/vocab` `datasets/g18/bibliography.yaml`.
   - OIML central secretariat is the authoritative source.
   - Likely needs a request to OIML to confirm TC/SC mapping for all 88 publications.
2. Maintain the mapping as a single canonical file (the bibliography) so other tools can consume it.
3. Mirror the mapping into this repo (under `tc-sc/publications.yaml` or similar) once stable.

## Why this is hard

- OIML has multiple TCs (TC 1 to TC 18+) and many SCs.
- The same publication might involve multiple TCs.
- Historical publications (pre-2000) may have uncertain TC/SC attribution.
- The mapping might change over time (TCs get restructured).

## Acceptance

- `bibliography.yaml` in the vocab repo has a `tc_sc` field on every entry.
- A copy of the TC/SC map lives in this repo at `tc-sc/publications.yaml` (or similar).
- A validator check verifies every G 18 entry's `source` publication has a TC/SC mapping.

## Open questions

- What's the canonical source of truth for TC/SC attribution? (OIML central secretariat? Their website? An internal data file?)
- For multi-TC publications, do we record one or all?
- For "dead" TCs (no longer active), how do we handle?
