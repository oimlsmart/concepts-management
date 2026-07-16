# 27 — Add specs for untested components

## Context
3 of 7 Vue components lack specs:
- ConceptDiffView.vue (concept diff renderer)
- DecisionFlowSVG.vue (CSS flow diagram)
- EditionFilterButtons.vue (may be removed — G 18 filters going away)

Plus the new component from PR #148:
- RecommendationBanner.vue — has test ✓

## Plan
- Write ConceptDiffView.test.ts (mount with sample diff, assert structure)
- Write DecisionFlowSVG.test.ts (mount with each case, assert active path)
- EditionFilterButtons: skip if it's being removed (TODO 04 direction)

## Why
Each component should have at least a smoke test verifying it renders
without errors for its expected props.
