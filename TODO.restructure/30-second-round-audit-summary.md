# 30 — Second-round audit summary (2026-07-17)

## What was audited
Deep sweep of file sizes, test coverage, and duplication across
lib/, scripts/, web/src/, and spec/.

## New findings (this round)

### Code quality
- **Stale backup file**: `web/src/islands/TcDetailPage.vue.bak` committed by accident
- **Dead references**: `typeOrder` arrays still include removed `adopt_vim`/`adopt_viml`
- **`typeOrder` duplicated** in PublicationDetailPage and TcDetailPage (exact same array)
- **Loaders god module**: 536 lines with 5 concerns
- **`ProposalsPage`**: 615 lines, needs decomposition
- **`EditionFilter` state**: duplicated across 5 islands

### Missing specs
- No `Pipeline` integration spec
- `ConceptDiffView`, `DecisionFlowSVG` components untested

## Addressed in this session
- TODO 23 (cleanup) — see PR #...
- TODO 24 (DRY typeOrder) — see PR #...
- TODO 26 (Pipeline spec) — see PR #...
- TODO 27 (component specs) — see PR #...
- TODO 25 (Loaders decomposition) — see PR #...

## Documented but not addressed
- TODO 28 (ProposalsPage) — needs scope investigation
- TODO 29 (useEditionFilter) — needs all 5 islands updated in lockstep
- TODO 18 (Case 2) — feature work
- TODO 20 (data/ gitignore) — needs user judgment
- TODO 21 (legacy site renderer) — needs user judgment

## Architectural state
- Backend: 4 namespaces (Migration, Actions, Export, Site) each with
  focused sub-modules. Compiler is OCP-compliant. Autoload tree set up.
- Frontend: 1 of N TermDetailPage sections extracted (RecommendationBanner).
  action-utils.ts is the canonical home for action metadata.
- Specs: ~80 Ruby examples on main (+48 on OCP branch, +9 on export-module-specs);
  ~184 frontend examples.
