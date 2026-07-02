<script setup lang="ts">
import termBySlugData from "../../data/term-by-slug.json";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
const bySlug: any = termBySlugData;
</script>

<template>
  <section v-if="!term" class="card">
    <p>Term not found.</p>
  </section>
  <template v-else>
    <section class="page-head">
      <div class="breadcrumb">
        <a href="/">Registry</a> /
        <a href="/terms/">Terms</a> /
        <span>{{ term.name }}</span>
      </div>
      <h1>{{ term.name }}</h1>
      <p class="lede">
        <span :class="['kind', `kind-${term.kind}`]">{{ kindLabel(term.kind) }}</span>
        <span v-if="matchStatus" :class="['match-status', `match-status-${matchStatus.key}`]">{{ matchStatus.label }}</span>
        G 18 #{{ term.identifier }} · {{ term.publications.length }} publication instance{{ term.publications.length === 1 ? "" : "s" }}
      </p>
    </section>

    <aside class="legend">
      <h3>How to read this page</h3>
      <div class="legend-row">
        <span class="legend-label">VIM:</span>
        <span class="viml-ref vim-current">VIM 2012<span class="viml-latest-badge">Latest</span></span>
        <span class="viml-ref vim-prior">VIM 2010, 2007</span>
        <span class="viml-ref vim-legacy">VIM 1993</span>
      </div>
      <div class="legend-row">
        <span class="legend-label">VIML:</span>
        <span class="viml-ref viml-current">VIML 2022<span class="viml-latest-badge">Latest</span></span>
        <span class="viml-ref viml-prior">VIML 2013, 2000</span>
        <span class="viml-ref viml-legacy">VIML 1968</span>
      </div>
      <p style="margin: 0.5em 0 0; font-size: 0.85em; color: var(--gray-text);">
        Authoritative definitions form the baseline against which OIML publication definitions are compared. Newer editions take precedence; older ones are shown faded and may have been superseded.
      </p>
    </aside>

    <section class="card">
      <h2>Authoritative definition</h2>
      <template v-if="term.kind !== 'undefined' && term.official_concept">
        <div :class="['authority-defn', confidenceClass(term.official_concept.source)]">
          <div class="authority-defn-head">
            <span :class="confidenceClass(term.official_concept.source)">
              {{ term.official_concept.edition_label || term.official_concept.source }}
              <span v-if="currentOf(term.official_concept.source)" class="viml-latest-badge">Latest</span>
            </span>
            · concept <strong>#{{ term.official_concept.id }}</strong>
            <span v-if="term.official_concept.url"> · <a class="external" :href="term.official_concept.url">view ↗</a></span>
          </div>
          <p v-if="term.official_concept.definition_text" class="authority-defn-body">{{ term.official_concept.definition_text }}</p>
          <p v-else class="muted" style="margin: 0.3em 0;">Definition text unavailable for this edition.</p>
        </div>
        <div v-if="supersededOf(term.official_concept.source)" class="admonition warn">
          <strong>Outdated reference:</strong> This term cites {{ term.official_concept.edition_label }}, which has been superseded. The latest authoritative edition of the same vocabulary is <strong>{{ latestOf(term.official_concept.source) }}</strong> — editors should re-check whether the term still appears there with the same or a revised definition.
        </div>
      </template>
      <p v-else class="muted">Not defined in VIM or VIML.</p>

      <template v-if="(term.related || []).length">
        <h3>Related VIM/VIML references</h3>
        <ul class="related-list">
          <li v-for="(edge, i) in term.related" :key="i">
            <template v-if="edge.ref">
              <span :class="confidenceClass(edge.ref.source)">
                {{ edge.ref.edition_label || edge.ref.source }}
                <span v-if="currentOf(edge.ref.source)" class="viml-latest-badge">Latest</span>
              </span>
              · concept <strong>#{{ edge.ref.id }}</strong>
              <a v-if="urlOf(edge.ref.source, edge.ref.id)" class="external" :href="urlOf(edge.ref.source, edge.ref.id)">view ↗</a>
              <div v-if="edge.ref.definition_text" class="authority-defn-body" style="margin-top: 0.4em; font-size: 0.92em;">{{ edge.ref.definition_text }}</div>
            </template>
          </li>
        </ul>
      </template>
    </section>

    <section v-if="actions.length" class="card">
      <h2>Suggested actions for TC 1 / Vocabularies</h2>
      <ol class="actions-list">
        <li v-for="(a, i) in actions" :key="i" :class="['action', `action-${a.priority}`]">
          <span :class="['action-pill', `action-pill-${a.priority}`]">{{ a.priority.toUpperCase() }}</span>
          <span class="action-text">{{ a.text }}</span>
          <template v-if="a.link && a.label"> · <a :href="a.link">{{ a.label }}</a></template>
        </li>
      </ol>
    </section>

    <section class="card">
      <div class="card-head">
        <h2>Publication instances</h2>
        <div class="pub-controls">
          <label class="inline-check">
            <input type="checkbox" v-model="onlyDivergent" @change="updateTable" />
            Show only divergent definitions
          </label>
          <span class="edition-filter">
            Show editions:
            <label v-for="ed in (term.editions_present || [])" :key="ed" class="inline-check edition-toggle-label">
              <input type="checkbox" :checked="enabledEditions.has(ed)" @change="toggleEdition(ed)" />
              <span :class="['edition-pill', `edition-${ed.toLowerCase()}`]">{{ ed }}</span>
            </label>
          </span>
        </div>
      </div>
      <table class="pubs-table">
        <thead>
          <tr>
            <th>Ed.</th>
            <th>Year</th>
            <th>Publication</th>
            <th>TC/SC</th>
            <th>Clause</th>
            <th>Definition</th>
            <th>Consistency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in term.publications" :key="p.publication_id + p.g18_entry"
            :class="['pub-row', distinctDefs.length > 1 && p.definition !== distinctDefs[0] ? 'row-divergent' : '']"
            v-show="enabledEditions.has(p.edition)">
            <td>
              <span :class="['edition-pill', `edition-${(p.edition || '').toLowerCase()}`]">{{ p.edition }}</span>
            </td>
            <td class="num">{{ p.year || "—" }}</td>
            <td>
              <a :href="`/publications/${p.publication_id}/`">{{ p.publication }}</a>
              <div class="g18-ref">G 18 #{{ p.g18_entry }}</div>
            </td>
            <td>
              <a v-if="p.tc_sc" :href="`/tc/${p.tc_sc}/`">{{ p.tc_sc }}</a>
              <span v-else class="muted">—</span>
            </td>
            <td class="num">{{ p.clause || "—" }}</td>
            <td class="definition">
              <div class="def-text">{{ p.definition || "(no definition recorded)" }}</div>
            </td>
            <td>
              <span :class="['badge', `badge-${p.consistency || 'pending'}`]">{{ p.consistency || "pending" }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </template>
</template>

<script lang="ts">
import { ref } from "vue";
const onlyDivergent = ref(false);
function updateTable() {
  // No-op: v-show handles visibility based on row data and onlyDivergent.
  // (Kept as a placeholder to avoid the v-model throwing on the form.)
}
</script>
