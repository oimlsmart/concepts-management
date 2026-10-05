<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { useVocabGaps, vocabGaps, type GapScope } from "@/composables/useVocabGaps";
import { usePagination } from "@/composables/usePagination";
import SLink from "@/components/SLink.vue";
import PaginationControls from "@/components/PaginationControls.vue";
import ProposalModal from "@/components/ProposalModal.vue";
import { syncToUrl } from "@/composables/useUrlState";

const { search, scope, tcFilter, lifecycle, allTCs, filtered } = useVocabGaps();
const pagination = usePagination(filtered, {
  pageSize: 50,
  dep: () => `${scope.value}|${lifecycle.value}|${tcFilter.value}|${search.value}`,
});

const VALID_SCOPES: GapScope[] = ["v3-match", "v1-match", "v2-match", "all"];

syncToUrl(search, "q");
syncToUrl(tcFilter, "tc");
syncToUrl(lifecycle, "lifecycle");
syncToUrl(scope, "scope", {
  parse: (raw) => (VALID_SCOPES as string[]).includes(raw) ? (raw as GapScope) : scope.value,
});
syncToUrl(pagination.page, "page", { parse: v => Math.max(1, Number(v) || 1), defaultValue: 1 });

// ?term= auto-open: deep-link from the gaps table or external sources lands
// here with the modal pre-filled. The modal is shared with TermDetailPage.
const modalRef = ref<InstanceType<typeof ProposalModal> | null>(null);
onMounted(() => {
  const termSlug = new URLSearchParams(window.location.search).get("term");
  if (!termSlug) return;
  const gap = vocabGaps.find(g => g.slug === termSlug);
  if (!gap) return;
  nextTick(() => modalRef.value?.open(gap));
});

// Scope filter now leads with conceptual categories (V 3 candidates /
// V 1/V 2 candidates / All) instead of abstract near-miss labels.
// Counts split by lifecycle so users see "X current · Y historic".
const scopeButtons: { val: typeof scope.value; concept: string; target: string; current: number; historic: number }[] = [
  {
    val: "v3-match",
    concept: "V 3 candidates",
    target: "no near-miss",
    current: vocabGaps.filter(g => !g.near_misses.vim && !g.near_misses.viml && g.is_current !== false).length,
    historic: vocabGaps.filter(g => !g.near_misses.vim && !g.near_misses.viml && g.is_historic === true).length,
  },
  {
    val: "v1-match",
    concept: "V 1 candidates",
    target: "VIML near-miss",
    current: vocabGaps.filter(g => g.near_misses.viml && g.is_current !== false).length,
    historic: vocabGaps.filter(g => g.near_misses.viml && g.is_historic === true).length,
  },
  {
    val: "v2-match",
    concept: "V 2 candidates",
    target: "VIM near-miss",
    current: vocabGaps.filter(g => g.near_misses.vim && g.is_current !== false).length,
    historic: vocabGaps.filter(g => g.near_misses.vim && g.is_historic === true).length,
  },
  {
    val: "all",
    concept: "All",
    target: "",
    current: vocabGaps.filter(g => g.is_current !== false).length,
    historic: vocabGaps.filter(g => g.is_historic === true).length,
  },
];

function nearMissBadgeClass(nm: any): string {
  if (!nm) return "muted";
  return nm.match_type === "exact" ? "badge badge-ok" : "badge badge-partial";
}
function nearMissText(nm: any): string {
  if (!nm) return "—";
  return nm.match_type === "exact" ? nm.designation : `${nm.designation} (${nm.similarity})`;
}
</script>

<template>
  <div class="page-head">
    <div class="breadcrumb"><SLink to="/">Home</SLink> / <span>Analysis</span> / <span>Vocabulary gaps</span></div>
    <h1>Vocabulary gap analysis</h1>
    <p class="lede">
      G 18 terms with no authoritative VIM/VIML source. For each, decide:
      propose for <strong>VIML (V 1)</strong> (legal metrology concept),
      <strong>VIM (V 2)</strong> (general metrology concept), or
      <strong>V 3</strong> (specific terms like "load cell" — proposed new vocabulary).
    </p>
  </div>

  <!-- How to propose: prerequisites and steps -->
  <div class="proposal-howto">
    <div class="proposal-howto-head">How to propose</div>
    <ol class="proposal-howto-steps">
      <li>
        <strong>Prerequisite.</strong>
        You need a GitHub account and TC 1 (Vocabulary) member access to the
        <a href="https://github.com/oimlsmart" target="_blank" rel="noopener">OIML GitHub organization</a>.
        No access? Contact the TC 1 secretariat.
      </li>
      <li>
        <strong>Find</strong> a term below that lacks a VIM/VIML definition.
        Use the scope filter to focus on V 3 candidates (no near-miss),
        V 1 candidates (VIML near-miss), or V 2 candidates (VIM near-miss).
      </li>
      <li>
        <strong>Propose</strong> by clicking the "Propose" button on a term.
        Choose its target — <strong>V 1</strong> (VIML) or <strong>V 2</strong> (VIM)
        adds the term to the next edition of an existing vocabulary;
        <strong>V 3</strong> proposes a brand-new vocabulary for specific terms.
        Add your rationale.
      </li>
      <li>
        <strong>Submit.</strong>
        A pre-filled GitHub issue opens with a structured YAML payload and
        checksum. Review and submit it for TC 1 consideration.
      </li>
    </ol>
  </div>

  <!-- Sticky scope filter — leads with conceptual categories -->
  <div class="page-filter" role="region" aria-label="Scope filter">
    <span class="page-filter-label">Scope</span>
    <div class="page-filter-controls">
      <button v-for="b in scopeButtons" :key="b.val"
              type="button"
              :class="['page-filter-btn', { 'page-filter-btn-active': scope === b.val }]"
              @click="scope = b.val">
        <span class="page-filter-btn-title">{{ b.concept }}</span>
        <span class="page-filter-btn-meta">
          <span>{{ b.current }} current<template v-if="b.historic > 0"> · {{ b.historic }} historic</template></span>
        </span>
      </button>
    </div>
  </div>

  <!-- Lifecycle toggle: Current candidates are the actionable set;
       Historic (terms only cited by retired/withdrawn pubs) is opt-in. -->
  <div class="page-filter" role="region" aria-label="Lifecycle filter">
    <span class="page-filter-label">Lifecycle</span>
    <div class="page-filter-controls">
      <button type="button"
              :class="['page-filter-btn', { 'page-filter-btn-active': lifecycle === 'current' }]"
              @click="lifecycle = 'current'">
        <span class="page-filter-btn-title">Current candidates</span>
        <span class="page-filter-btn-meta">terms cited by active publications</span>
      </button>
      <button type="button"
              :class="['page-filter-btn', { 'page-filter-btn-active': lifecycle === 'historic' }]"
              @click="lifecycle = 'historic'">
        <span class="page-filter-btn-title">Historic only</span>
        <span class="page-filter-btn-meta">terms cited only by retired/withdrawn pubs</span>
      </button>
      <button type="button"
              :class="['page-filter-btn', { 'page-filter-btn-active': lifecycle === 'all' }]"
              @click="lifecycle = 'all'">
        <span class="page-filter-btn-title">All</span>
        <span class="page-filter-btn-meta">current + historic</span>
      </button>
    </div>
  </div>

  <section class="card">
    <form class="filter-form" @submit.prevent>
      <input v-model="search" type="search" placeholder="Search term…" />
      <select v-model="tcFilter">
        <option value="">All TC/SCs</option>
        <option v-for="tc in allTCs" :key="tc" :value="tc">{{ tc }}</option>
      </select>
      <span class="muted">{{ filtered.length }} shown</span>
    </form>

    <!-- Desktop table — only the Propose action + minimal context columns
         are always shown. Definition is a hint column (hidden on narrow
         viewports) so the Propose button is always reachable. -->
    <div class="table-scroll table-only-desktop">
      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Near-miss</th>
            <th class="num">Pubs</th>
            <th class="vocab-gaps-def">Definition (first)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in pagination.visible.value" :key="g.slug">
            <td class="term-cell"><SLink :to="`/concepts/${g.slug}/`">{{ g.name }}</SLink></td>
            <td>
              <div class="vocab-gaps-nm">
                <span v-if="g.near_misses.vim || g.near_misses.viml" class="vocab-gaps-nm-badges">
                  <a v-if="g.near_misses.viml" :href="g.near_misses.viml.url" target="_blank" rel="noopener" :class="nearMissBadgeClass(g.near_misses.viml)" :title="(g.near_misses.viml.designation || '') + (g.near_misses.viml.match_type === 'exact' ? ' (exact)' : ` (sim ${g.near_misses.viml.similarity})`) + ' — click to view full definition on vocab site'">VIML: {{ nearMissText(g.near_misses.viml) }}</a>
                  <a v-if="g.near_misses.vim" :href="g.near_misses.vim.url" target="_blank" rel="noopener" :class="nearMissBadgeClass(g.near_misses.vim)" :title="(g.near_misses.vim.designation || '') + (g.near_misses.vim.match_type === 'exact' ? ' (exact)' : ` (sim ${g.near_misses.vim.similarity})`) + ' — click to view full definition on vocab site'">VIM: {{ nearMissText(g.near_misses.vim) }}</a>
                </span>
                <span v-else class="muted">no near-miss</span>
              </div>
            </td>
            <td class="num">{{ g.publications.length }}</td>
            <td class="vocab-gaps-def"><span class="muted" style="font-size:0.88em">{{ (g.definitions[0] || '—').slice(0, 80) }}{{ (g.definitions[0] || '').length > 80 ? '…' : '' }}</span></td>
            <td><button type="button" class="gap-card-cta" @click="modalRef?.open(g)">Propose</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards: redesigned for thumb-friendly scanning.
         Hero = term name. Single-line summary. Propose as primary CTA. -->
    <ul class="gap-cards table-only-mobile">
      <li v-for="g in pagination.visible.value" :key="g.slug" class="gap-card">
        <div class="gap-card-top">
          <SLink :to="`/concepts/${g.slug}/`" class="gap-card-name">{{ g.name }}</SLink>
          <span class="gap-card-pubs">{{ g.publications.length }} pub{{ g.publications.length === 1 ? '' : 's' }}</span>
        </div>
        <div class="gap-card-status">
          <span v-if="g.near_misses.viml" class="gap-card-chip gap-card-chip-viml">VIML match</span>
          <span v-else class="gap-card-chip gap-card-chip-empty">no VIML</span>
          <span v-if="g.near_misses.vim" class="gap-card-chip gap-card-chip-vim">VIM match</span>
          <span v-else class="gap-card-chip gap-card-chip-empty">no VIM</span>
        </div>
        <button type="button" class="gap-card-cta" @click="modalRef?.open(g)">Propose</button>
      </li>
    </ul>

    <PaginationControls :pagination="pagination" noun="terms" />
  </section>

  <ProposalModal ref="modalRef" />
</template>

<style scoped>
.proposal-howto {
  background: var(--color-accent-tint);
  border: 1px solid var(--color-accent-soft);
  border-radius: 6px;
  padding: 1em 1.2em;
  margin-bottom: 1.2em;
}
.proposal-howto-head {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  margin-bottom: 0.5em;
}
.proposal-howto-steps {
  margin: 0;
  padding-left: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}
.proposal-howto-steps li {
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--color-ink-soft);
}
.proposal-howto-steps li strong {
  color: var(--color-ink);
}

.vocab-gaps-nm {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  font-size: 0.78rem;
}
.vocab-gaps-nm-badges {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}
.vocab-gaps-nm-badges .badge {
  font-size: 0.72rem;
  max-width: 24ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.vocab-gaps-nm-badges .badge:hover { opacity: 0.85; }
.vocab-gaps-def {
  max-width: 220px;
}
@media (max-width: 1100px) {
  .vocab-gaps-def { display: none; }
}
@media (max-width: 820px) {
  /* The page-filter buttons become cards on narrow viewports too; they
     can be mistaken for term content. Tighten to look like controls. */
  .page-filter-btn { min-width: 0; padding: 0.4em 0.7em; }
  .page-filter-btn-meta { font-size: 0.7rem; }
}
.gap-cards {
  list-style: none;
  margin: 0.5rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.gap-card {
  background: var(--color-paper-soft);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.gap-card-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5em;
}
.gap-card-name {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.05rem;
  color: var(--color-ink);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.gap-card-pubs {
  font-size: 0.78rem;
  color: var(--color-ink-muted);
  white-space: nowrap;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}
.gap-card-status {
  display: flex;
  gap: 0.4em;
  flex-wrap: wrap;
}
.gap-card-chip {
  font-size: 0.7rem;
  padding: 0.15em 0.55em;
  border-radius: 9999px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.gap-card-chip-viml {
  background: var(--status-ok-bg);
  color: var(--status-ok-text);
}
.gap-card-chip-vim {
  background: var(--status-info-bg);
  color: var(--status-info-text);
}
.gap-card-chip-empty {
  background: var(--color-rule-soft);
  color: var(--color-ink-muted);
  font-weight: 500;
}
.gap-card-cta {
  appearance: none;
  border: 1px solid var(--color-accent);
  background: transparent;
  color: var(--color-accent);
  padding: 0.35em 0.9em;
  border-radius: 4px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  align-self: flex-start;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.gap-card-cta:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
</style>
