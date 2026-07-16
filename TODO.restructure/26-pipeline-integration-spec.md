# 26 — Pipeline integration spec

## Context
The export pipeline (G18::Export::Pipeline) has unit specs for each
module but no end-to-end spec. A regression in how modules interact
would slip through.

## Plan
Create `spec/export/pipeline_spec.rb`:
- Spawns a tmpdir with sample vocab datasets (1-2 concepts each)
- Spawns a tmpdir for output
- Runs Pipeline.call
- Asserts every output JSON exists and has expected shape:
  - terms.json (1 entry per term)
  - terms-slim.json (slim fields)
  - terms-medium.json
  - dashboard.json (alignment_counts, total_terms)
  - publications.json (lifecycle set)
  - tc.json, tc-stats.json
  - conflicts.json (raw + designation_collisions)
  - vocab-gaps.json
  - edition-stats.json
  - harmonization.json, harmonization-slim.json
  - actions-data.json, g18-dynamic.json, readiness-stats.json,
    leaderboard-data.json, pub-list.json
  - Per-term detail JSON in web/public/data/terms/
  - Per-pub detail JSON in web/public/data/publications/
  - Per-tc detail JSON in web/public/data/tcs/

## Why
- Locks in the contract between modules
- Catches regressions in any of the 17 JSON outputs
- Documents expected output shape

## Note
This spec is the highest-value test we can add for the export pipeline
because it validates the *integration* of all modules.
