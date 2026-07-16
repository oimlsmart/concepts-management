# 06 — Architecture audit findings

## CRITICAL issues

### 6.1 Export script is a god object (999 lines, 6+ responsibilities)
**File**: `scripts/export_for_vite.rb`
**Action**: Split into modules:
- `G18::Export::Renderer` — Plurimath/MathML rendering (lines 42-68)
- `G18::Export::GlossaristBridge` — Node.js bridge for concept loading (lines 93-153)
- `G18::Export::PublicationEnricher` — relaton + lifecycle (lines 270-400)
- `G18::Export::Matching` — check_latest_edition + check_vocab_presence (lines 180-268)
- `G18::Export::TermProcessor` — main term loop (lines 415-553)
- `G18::Export::JsonWriter` — all JSON output (lines 600-999)

### 6.2 Global mutable state
**File**: `scripts/export_for_vite.rb:121`
**Issue**: `$cited_concept_cache = {}` — global variable
**Action**: Move to instance variable on a class or module

### 6.3 Zero Ruby spec coverage for migration
**Files**: `lib/g18/migration/*.rb` (0 specs)
**Action**: Add spec/ directory with:
- `spec/migration/loaders_spec.rb`
- `spec/migration/builders_spec.rb`
- `spec/migration/runner_spec.rb`
- `spec/migration/conflicts_spec.rb`
- `spec/fuzzy_match_spec.rb`
- `spec/export/matching_spec.rb`

## MEDIUM issues

### 6.4 Duplicated dedup + strip logic
- Pub dedup by (pub_id, clause): lines 606-611 and 892-895
- STRIP_FROM_PUB application: lines 644-648 and 656-660
- sourced_from extraction: 3 copies (loaders.rb:55, loaders.rb:221, export:570)
**Action**: Extract to shared methods

### 6.5 Actions compiler not OCP-compliant
- Adding action type requires modifying compiler.rb, action.rb, action-utils.ts
**Action**: Strategy pattern or registry

### 6.6 "current" → "complete" mapping repeated 9 times
**Action**: Centralize in `edition-utils.ts`

### 6.7 Per-edition distinct-def count in 3 places
- action-utils.ts:66, TermDetailPage.vue:209, compiler.rb:236
**Action**: Pre-compute at export time, consume everywhere

### 6.8 Silent error swallowing
- 7 Ruby rescue-and-continue blocks
- 3 frontend fetch catch blocks
**Action**: Add error state to UI, add exit code for critical failures in export

### 6.9 Identical fetch pattern in 3 detail pages
**Action**: Extract `useJsonFetch<T>(url)` composable

## LOW issues
- "oiml_original || undefined" check repeated 5+ times → centralize as `oiml_specific?`
- `adopt_vim`/`adopt_viml` declared but never produced → remove or implement
- O(N*M) pub detail generation → build index first
- "term" vs "concept" naming inconsistency → document the domain distinction
