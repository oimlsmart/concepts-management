<script setup lang="ts">
import { ref, computed } from "vue";
import terms from "@/data/terms.json";

const search = ref("");
const onlyEdition = ref("");
const filtered = computed(() => {
  let t = terms as any[];
  if (onlyEdition.value) t = t.filter(x => x.editions_present?.includes(onlyEdition.value));
  if (search.value) {
    const q = search.value.toLowerCase();
    t = t.filter(x => x.name?.toLowerCase().includes(q));
  }
  return t.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
});
function kindLabel(k: string) { return k === "defined_in_vim" ? "VIM" : k === "defined_in_viml" ? "VIML" : "—"; }
function distinctDefs(pubs: any[]) { return new Set(pubs.map(p => (p.definition || "").trim()).filter(Boolean)).size; }
</script>

<template>
  <div class="page-head">
    <div class="breadcrumb"><RouterLink to="/">Registry</RouterLink> / <span>Terms</span></div>
    <h1>All terms</h1>
    <p class="lede">{{ terms.length }} unique terms, {{ (terms as any[]).reduce((s, t) => s + t.publications.length, 0) }} instances.</p>
  </div>
  <section class="card">
    <form style="display:flex;gap:1em;flex-wrap:wrap;align-items:center;margin-bottom:0.5em" @submit.prevent>
      <input v-model="search" type="search" placeholder="Search…" style="padding:0.3em 0.5em;min-width:16em;border:1px solid var(--rule);border-radius:3px" />
      <select v-model="onlyEdition"><option value="">All editions</option><option value="2010">2010 only</option><option value="202X">202X only</option></select>
      <span class="muted">{{ filtered.length }} shown</span>
    </form>
    <table>
      <thead><tr><th>Term</th><th>VIM</th><th>Ed.</th><th>Inst.</th><th>Defs</th></tr></thead>
      <tbody>
        <tr v-for="t in filtered" :key="t.slug">
          <td><RouterLink :to="`/terms/${t.slug}/`">{{ t.name }}</RouterLink></td>
          <td><span :class="['kind', `kind-${t.kind}`]">{{ kindLabel(t.kind) }}</span></td>
          <td><span v-for="e in t.editions_present" :key="e" :class="['edition-pill', `edition-${e.toLowerCase()}`]">{{ e }}</span></td>
          <td class="num">{{ t.publications.length }}</td>
          <td class="num">{{ distinctDefs(t.publications) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
