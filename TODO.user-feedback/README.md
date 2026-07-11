# User Feedback — Term Detail Page Issues

Source: user review of https://www.oimlsmart.org/g18-registry/terms/adjustment/

## Issues to fix

1. **Remove cross-edition drift block** — G 18 is a working tool, not a reference. Drift between 2010/202X is of limited interest.
2. **Fix latest_check fuzzy match** — "adjustment" doesn't exact-match "adjustment of a measuring system" in VIM 2012, causing false "removed" flag and wrong "Outdated" label.
3. **Simplify designations for VIM/VIML terms** — duplicates concept card info.
4. **Fix provenance labels** — "OIML-original - Authoritative" is misleading.
5. **Clarify harmonize description** — "2 distinct definitions" is a typo difference, not real divergence.
6. **Fix broken publication links** — R 142-1:2025 missing from publications.json (404).
7. **Fix action accuracy** — When latest_check finds term via fuzzy match, action should be "upgrade" not "removed".
