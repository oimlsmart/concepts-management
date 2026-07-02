<script setup lang="ts">
import termsData from "../../data/terms.json";
import editionStatsData from "../../data/edition-stats.json";
import { ref, computed } from "vue";

const terms: any = termsData;
const editionStats: any = editionStatsData;
const search = ref("");
const onlyEdition = ref<"" | "2010" | "202X">("");

function kindLabel(k: string) {
  if (k === "defined_in_vim") return "VIM";
  if (k === "defined_in_viml") return "VIML";
  return "—";
}

const filtered = computed(() => {
  let t = terms;
  if (onlyEdition.value) {
    t = t.filter((term: any) => (term.editions_present || []).includes(onlyEdition.value));
  }
  if (search.value) {
    const q = search.value.toLowerCase();
    t = t.filter((term: any) => (term.name || "").toLowerCase().includes(q));
  }
  return t.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
});
</script>

<template>
  <section class="page-head">
    <div class="breadcrumb">
      <a href="/">Registry</a> /
      <span>Terms</span>
    </div>
    <h1>All terms</h1>
    <p class="lede">{{ terms.length }} unique terms, grouped from {{ terms.reduce((s: number, t: any) => s + t.publications.length, 0) }} publication instances across editions.</p>
  </section>

  <section class="card">
    <form class="filter-form" @submit.prevent>
      <input type="search" v-model="search" placeholder="Search term name…" />
      <label>Show only:
        <select v-model="onlyEdition">
          <option value="">All editions</option>
          <option value="2010">2010 only</option>
          <option value="202X">202X only</option>
        </select>
      </label>
      <span class="count-line">Showing {{ filtered.length }} of {{ terms.length }}</span>
    </form>
    <table>
      <thead>
        <tr>
          <th>Term</th>
          <th>VIM/VIML</th>
          <th>Ed.</th>
          <th>Instances</th>
          <th>Distinct defs</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in filtered" :key="t.slug">
          <td><a :href="`/terms/${t.slug}/`">{{ t.name }}</a></td>
          <td><span :class="['kind', `kind-${t.kind}`]">{{ kindLabel(t.kind) }}</span></td>
          <td>
            <span v-for="e in (t.editions_present || [])" :key="e" :class="['edition-pill', `edition-${e.toLowerCase()}`]">{{ e }}</span>
          </td>
          <td class="num">{{ t.publications.length }}</td>
          <td class="num">{{ new Set(t.publications.map((p: any) => (p.definition || '').trim()).filter(Boolean)).size }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
