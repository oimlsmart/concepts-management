# 09 — Frontend improvements

## 9.1 useJsonFetch composable
Extract the identical fetch pattern from 3 detail pages:
```ts
// web/src/composables/useJsonFetch.ts
export function useJsonFetch<T>(url: ComputedRef<string> | string) {
  const data = ref<T | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  onMounted(async () => {
    try {
      const res = await fetch(typeof url === 'string' ? url : url.value);
      if (res.ok) data.value = await res.json();
      else error.value = `HTTP ${res.status}`;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Fetch failed';
    } finally {
      loading.value = false;
    }
  });
  return { data, loading, error };
}
```
Apply to: TermDetailPage, PublicationDetailPage, TcDetailPage.

## 9.2 Edition name constants
Centralize edition name → data name mapping:
```ts
// web/src/utils/edition-utils.ts
export const EDITION_NAMES = {
  CURRENT: "complete",
  G18_202X: "202X",
  G18_2010: "2010",
} as const;

export function editionDataName(uiName: string): string {
  return uiName === "current" ? EDITION_NAMES.CURRENT : uiName;
}

export function editionLabel(dataName: string): string {
  if (dataName === "complete") return "OIML";
  return dataName;
}
```
Replace all 9 inline `"current" ? "complete"` mappings.

## 9.3 Remove useSuggestedActions re-export indirection
`useSuggestedActions.ts` re-exports everything from `action-utils.ts`. Either:
- Merge them into one file, OR
- Have pages import directly from `action-utils.ts`

## 9.4 Centralize "oiml_specific?" check
```ts
// In action-utils.ts
export function isOimlSpecific(kind: string): boolean {
  return kind === "oiml_original" || kind === "undefined";
}
```
Replace 5+ inline checks.
