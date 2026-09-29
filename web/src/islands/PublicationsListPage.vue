<script setup lang="ts">
import { computed, ref } from "vue";
import publications from "@/data/pub-list.json";
import { isVocabularyPublication, slugify } from "@/utils/term-utils";
import { syncToUrl } from "@/composables/useUrlState";
import SLink from "@/components/SLink.vue";

const search = ref("");
// Only current publications can gain a new edition — the actionable set.
const lifecycleFilter = ref("current");
const hideEmpty = ref(true);

syncToUrl(search, "q");
syncToUrl(lifecycleFilter, "lifecycle", { defaultValue: "current" });
syncToUrl(hideEmpty, "hide_empty", {
  parse: v => v === "1" || v === "true",
  serialize: v => (v ? "1" : "0"),
  defaultValue: true,
});

// VIM/VIML editions (OIML V 1 …, OIML V 2-200 …) are vocabularies, not OIML
// publications — excluded from the list and from every count on the page.
// Checked on both id (the row's link target) and reference (its label).
const listedPubs = (publications as any[]).filter(
  p => !isVocabularyPublication(p.id) && !isVocabularyPublication(p.reference),
);

function termCount(pub: any): number { return pub.term_count || 0; }

const sortedPubs = computed(() => {
  return [...listedPubs].sort((a, b) => {
    const tc = termCount(b) - termCount(a);
    if (tc !== 0) return tc;
    return (a.id || "").localeCompare(b.id || "");
  });
});

const filtered = computed(() => {
  let pubs = sortedPubs.value;
  if (hideEmpty.value) {
    pubs = pubs.filter(p => termCount(p) > 0);
  }
  if (lifecycleFilter.value) {
    pubs = pubs.filter(p => (p.lifecycle || "current") === lifecycleFilter.value);
  }
  if (search.value) {
    const q = search.value.toLowerCase();
    pubs = pubs.filter(p => (p.id || "").toLowerCase().includes(q));
  }
  return pubs;
});

const lifecycleCounts = computed(() => {
  const c = { current: 0, retired: 0, withdrawn: 0 };
  for (const p of listedPubs) {
    const lc = p.lifecycle || "current";
    if (c[lc] !== undefined) c[lc]++;
  }
  return c;
});

const totalWithTerms = computed(() =>
  listedPubs.filter(p => termCount(p) > 0).length
);

function lifecycleBadge(lc: string): { label: string; cls: string } {
  if (lc === "withdrawn") return { label: "Withdrawn", cls: "lc-withdrawn" };
  if (lc === "retired") return { label: "Retired", cls: "lc-retired" };
  return { label: "Current", cls: "lc-current" };
}
</script>

<template>
  <div class="page-head">
    <div class="breadcrumb"><SLink to="/">Home</SLink> / <span>Publications</span></div>
    <h1>Publications</h1>
    <p class="lede">{{ totalWithTerms }} publications with terms · {{ lifecycleCounts.current }} current · {{ lifecycleCounts.retired }} retired · {{ lifecycleCounts.withdrawn }} withdrawn</p>
  </div>

  <section class="card">
    <form class="filter-form" @submit.prevent role="search" aria-label="Filter publications">
      <input v-model="search" type="search" placeholder="Search publication…" aria-label="Search publications by ID" />
      <select v-model="lifecycleFilter" aria-label="Filter by lifecycle status">
        <option value="">All statuses</option>
        <option value="current">Current only</option>
        <option value="retired">Retired only</option>
        <option value="withdrawn">Withdrawn only</option>
      </select>
      <label><input type="checkbox" v-model="hideEmpty" /> Only show pubs with terms</label>
      <span class="muted">{{ filtered.length }} shown</span>
    </form>
    <div class="table-scroll">
      <table>
      <thead><tr><th>Reference</th><th>Status</th><th>Year</th><th>TC/SC</th><th class="num">Terms</th></tr></thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td><SLink :to="`/publications/${slugify(p.id)}/`">{{ p.reference || p.id }}</SLink></td>
          <td><span :class="['lc-badge', lifecycleBadge(p.lifecycle || 'current').cls]">{{ lifecycleBadge(p.lifecycle || 'current').label }}</span></td>
          <td class="num">{{ (p.id || '').match(/(\d{4})/)?.[1] || "—" }}</td>
          <td><SLink v-if="p.tc_sc" :to="`/tc/${p.tc_sc.toLowerCase().replace('/', '-')}/`">{{ p.tc_sc }}</SLink><span v-else class="muted">—</span></td>
          <td class="num">{{ termCount(p) }}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </section>
</template>

<style scoped>
.lc-badge {
  display: inline-block;
  padding: 0.1em 0.5em;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid;
}
.lc-current { background: var(--status-ok-bg); color: var(--status-ok-text); border-color: var(--status-ok-border); }
.lc-retired { background: var(--color-rule-soft); color: var(--color-ink-muted); border-color: var(--color-rule); }
.lc-withdrawn { background: var(--status-error-bg); color: var(--status-error-text); border-color: var(--status-error-border); }
</style>
