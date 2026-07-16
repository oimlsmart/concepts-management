# 23 — Cleanup: stale .bak file + dead adopt_* references

## Findings
1. `web/src/islands/TcDetailPage.vue.bak` is a stale backup from a sed
   operation in an earlier PR. Should never have been committed; safe
   to delete.
2. `typeOrder` arrays in PublicationDetailPage.vue (line 178) and
   TcDetailPage.vue (line 135) still reference `"adopt_vim"` and
   `"adopt_viml"` even though those action types were removed in PR #143.
   The references are silent (sort to index -1 → treated as 99), but
   they're dead code.

## Plan
- Delete `TcDetailPage.vue.bak`
- Remove `adopt_vim`/`adopt_viml` from both `typeOrder` arrays
- (Carry-over to TODO 24: move typeOrder into action-utils.ts)
