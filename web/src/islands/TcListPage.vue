<script setup lang="ts">
import { computed, ref } from "vue";
import tcData from "@/data/tc.json";
import terms from "@/data/terms.json";
import publicationsData from "@/data/publications.json";
import SLink from "@/components/SLink.vue";

type EditionFilter = "202X" | "2010" | "all";
const editionFilter = ref<EditionFilter>("202X");

// Per-edition counts: a term "belongs to" an edition if any of its pub
// instances under this TC/SC are in that edition. Publications similarly.
function pubTermsForEdition(name: string, edition: string | null) {
  return (terms as any[]).filter(t =>
    t.publications.some((p: any) =>
      p.tc_sc === name && (edition === null || p.edition === edition)
    )
  );
}
function termCount(name: string, edition: string | null) {
  return pubTermsForEdition(name, edition).length;
}
function pubCount(name: string, edition: string | null) {
  return new Set(
    (terms as any[]).flatMap(t => t.publications).filter((p: any) =>
      p.tc_sc === name && (edition === null || p.edition === edition)
    ).map((p: any) => p.publication_id)
  ).size;
}

const editionForFilter = computed<string | null>(() =>
  editionFilter.value === "all" ? null : editionFilter.value
);

// Publications with TC/SC from publications.json (relaton-enriched).
// Term instances may lack tc_sc but the publication itself may have one.
const pubTcScMap = computed(() => {
  const map: Record<string, string> = {};
  for (const p of (publicationsData as any[])) {
    if (p.tc_sc) map[p.id] = p.tc_sc;
  }
  return map;
});

// Publications that have terms in the selected edition but no TC/SC
// assignment anywhere — either a data quality issue (wrong pubid in
// relaton) or genuinely unassigned.
const unassignedPubs = computed(() => {
  const ed = editionForFilter.value;
  const ids = new Set<string>();
  for (const t of (terms as any[])) {
    if (ed && !(t.editions_present || []).includes(ed)) continue;
    for (const p of (t.publications || [])) {
      if (ed && p.edition !== ed) continue;
      if (!p.publication_id) continue;
      const tcSc = p.tc_sc || pubTcScMap.value[p.publication_id] || "";
      if (!tcSc || tcSc.trim() === "") {
        ids.add(p.publication_id);
      }
    }
  }
  return [...ids].sort();
});

const unassignedTermCount = computed(() => {
  const ed = editionForFilter.value;
  const unassignedIds = new Set(unassignedPubs.value);
  return (terms as any[]).filter(t =>
    t.publications.some((p: any) =>
      p.publication_id &&
      unassignedIds.has(p.publication_id) &&
      (ed === null || p.edition === ed)
    )
  ).length;
});

const showUnassigned = ref(false);

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
</script>

<template>
  <div class="page-head">
    <div class="breadcrumb"><SLink to="/">Registry</SLink> / <span>TC / SC</span></div>
    <h1>Technical Committees</h1>
    <p class="lede">{{ (tcData as string[]).length }} subcommittees. Default scope: G 18:202X (draft, TC 1 acts here).</p>
  </div>

  <!-- Sticky page-level edition filter -->
  <div class="page-filter" role="region" aria-label="G 18 edition filter">
    <span class="page-filter-label">G 18 edition</span>
    <div class="page-filter-controls">
      <button type="button"
              :class="['page-filter-btn', { 'page-filter-btn-active': editionFilter === '202X' }]"
              @click="editionFilter = '202X'">
        <span class="page-filter-btn-title">G 18:202X</span>
        <span class="page-filter-btn-meta">draft, TC 1 acts here</span>
      </button>
      <button type="button"
              :class="['page-filter-btn', { 'page-filter-btn-active': editionFilter === '2010' }]"
              @click="editionFilter = '2010'">
        <span class="page-filter-btn-title">G 18:2010</span>
        <span class="page-filter-btn-meta">historic, read-only</span>
      </button>
      <button type="button"
              :class="['page-filter-btn', { 'page-filter-btn-active': editionFilter === 'all' }]"
              @click="editionFilter = 'all'">
        <span class="page-filter-btn-title">All</span>
        <span class="page-filter-btn-meta">both editions</span>
      </button>
    </div>
  </div>

  <section class="card">
    <div class="table-scroll">
      <table>
      <thead><tr><th>TC / SC</th><th>Publications ({{ editionFilter === "all" ? "all" : editionFilter }})</th><th>Terms ({{ editionFilter === "all" ? "all" : editionFilter }})</th></tr></thead>
      <tbody>
        <tr v-for="t in (tcData as string[])" :key="t">
          <td><SLink :to="`/tc/${slug(t)}/`">{{ t }}</SLink></td>
          <td class="num">{{ pubCount(t, editionForFilter) }}</td>
          <td class="num">{{ termCount(t, editionForFilter) }}</td>
        </tr>
        <tr v-if="unassignedPubs.length" class="unassigned-row" @click="showUnassigned = !showUnassigned">
          <td>
            <span class="unassigned-label">Not assigned</span>
            <span class="unassigned-hint">{{ showUnassigned ? "▾" : "▸" }} {{ unassignedPubs.length }} pubs — likely wrong pubid or missing from relaton</span>
          </td>
          <td class="num">{{ unassignedPubs.length }}</td>
          <td class="num">{{ unassignedTermCount }}</td>
        </tr>
      </tbody>
    </table>
    </div>

    <!-- Expandable list of unassigned publications -->
    <div v-if="showUnassigned && unassignedPubs.length" class="unassigned-list">
      <div class="unassigned-list-head">Publications not assigned to any TC — check pubid spelling against relaton-data-oiml</div>
      <ul class="unassigned-pubs">
        <li v-for="pid in unassignedPubs" :key="pid">
          <SLink :to="`/publications/${pid.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/`">{{ pid }}</SLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.unassigned-row {
  cursor: pointer;
  border-top: 2px solid var(--status-warn-border);
  background: var(--status-warn-bg);
}
.unassigned-row:hover {
  background: color-mix(in srgb, var(--status-warn-bg) 80%, var(--color-paper));
}
.unassigned-row td {
  border-top: 2px solid var(--status-warn-border);
}
.unassigned-label {
  font-weight: 700;
  color: var(--status-warn-text);
}
.unassigned-hint {
  display: block;
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--color-ink-muted);
  margin-top: 0.15em;
}
.unassigned-list {
  margin-top: 0.8em;
  padding: 0.8em 1em;
  background: var(--status-warn-bg);
  border: 1px solid var(--status-warn-border);
  border-radius: 4px;
}
.unassigned-list-head {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--status-warn-text);
  margin-bottom: 0.5em;
}
.unassigned-pubs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em 1em;
}
.unassigned-pubs li {
  font-size: 0.84rem;
  font-family: var(--font-mono);
}
</style>
