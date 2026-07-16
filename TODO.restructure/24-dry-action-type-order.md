# 24 — DRY: action type ordering

## Context
The "action type display order" (which type appears first when grouping
actions) is duplicated:

- `web/src/islands/PublicationDetailPage.vue:178` — `typeOrder` array
- `web/src/islands/TcDetailPage.vue:135` — identical `typeOrder` array
- `web/src/islands/TermsListPage.vue:95` — `PRIORITY_ORDER` map (different shape)

Three islands, three slightly different orderings. They should agree.

## Plan
- Add `ACTION_TYPE_ORDER: string[]` and `actionTypeRank(type): number`
  to `web/src/composables/action-utils.ts`
- All three islands import and use it
- Single source of truth — when a new action type is added, it gets
  inserted into ACTION_TYPE_ORDER in one place

## Verification
- `pnpm test` passes
- `pnpm build` succeeds
- The visual order of action chips on `/actions/`, `/publications/{slug}/`,
  and `/tc/{slug}/` matches
