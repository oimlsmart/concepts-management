# 29 — useEditionFilter composable (DRY)

## Context
Multiple islands (TcDetailPage, PublicationDetailPage, ConflictsPage,
HarmonizationPage, G18ConceptsPage) have nearly identical edition filter
state + computed:

```ts
type EditionFilter = "current" | "202X" | "2010" | "all";
const editionFilter = ref<EditionFilter>("current");
const editionForFilter = computed(() =>
  editionFilter.value === "all" ? null : editionDataName(editionFilter.value)
);
```

5 copies of the same logic.

## Plan
Create `web/src/composables/useEditionFilter.ts`:
```ts
export function useEditionFilter(initial: EditionFilter = "current") {
  const editionFilter = ref<EditionFilter>(initial);
  const editionForFilter = computed(() =>
    editionFilter.value === "all" ? null : editionDataName(editionFilter.value)
  );
  return { editionFilter, editionForFilter };
}
```

Each island calls `const { editionFilter, editionForFilter } = useEditionFilter();`.

## Why
- Single source of truth for the edition filter logic
- Consistent default behavior across pages
- Easier to extend (e.g. URL sync) — change one place
