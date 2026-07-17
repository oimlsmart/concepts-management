// Loads and filters the vocab-gaps export. The export is pre-computed at
// build time (scripts/export_for_vite.rb) — this composable just wraps
// the JSON in a typed view and provides edition / search filters.
//
// Lifecycle filter: each gap is flagged at export time with `is_current`
// (any of its citing publications is current) or `is_historic` (all
// citing publications are retired/withdrawn). The UI leads with Current
// candidates (the actionable set); Historic is secondary context.

import { computed, ref } from "vue";
import gapsData from "@/data/vocab-gaps.json";

export interface VocabNearMiss {
  found: boolean;
  match_type: "exact" | "fuzzy";
  designation: string;
  concept_id: string;
  definition: string;
  similarity?: number;
  latest_label: string;
  url: string;
}

export interface VocabGap {
  slug: string;
  name: string;
  identifier: string;
  definitions: string[];
  publications: { publication_id: string; tc_sc: string; edition: string }[];
  editions_present: string[];
  is_current?: boolean;
  is_historic?: boolean;
  near_misses: {
    vim: VocabNearMiss | null;
    viml: VocabNearMiss | null;
  };
}

export const vocabGaps = gapsData as unknown as VocabGap[];

export type GapScope = "v3-match" | "v1-match" | "v2-match" | "all";
export type GapLifecycle = "current" | "historic" | "all";

export function useVocabGaps() {
  const search = ref("");
  const scope = ref<GapScope>("v3-match");
  const tcFilter = ref("");
  // Default: current candidates only (the actionable set). Historic is
  // opt-in via the lifecycle toggle.
  const lifecycle = ref<GapLifecycle>("current");

  const allTCs = computed(() => {
    const s = new Set<string>();
    for (const g of vocabGaps) {
      for (const p of g.publications) if (p.tc_sc) s.add(p.tc_sc);
    }
    return Array.from(s).sort();
  });

  const filtered = computed(() => {
    let list: VocabGap[] = vocabGaps;
    if (scope.value === "v3-match") {
      list = list.filter(g => !g.near_misses.vim && !g.near_misses.viml);
    } else if (scope.value === "v1-match") {
      list = list.filter(g => g.near_misses.viml);
    } else if (scope.value === "v2-match") {
      list = list.filter(g => g.near_misses.vim);
    }
    if (lifecycle.value === "current") {
      list = list.filter(g => g.is_current !== false);
    } else if (lifecycle.value === "historic") {
      list = list.filter(g => g.is_historic === true);
    }
    if (tcFilter.value) {
      list = list.filter(g => g.publications.some(p => p.tc_sc === tcFilter.value));
    }
    if (search.value) {
      const q = search.value.toLowerCase();
      list = list.filter(g => g.name?.toLowerCase().includes(q));
    }
    return list;
  });

  return { search, scope, tcFilter, lifecycle, allTCs, filtered };
}
