<script setup lang="ts">
import publications from "@/data/pub-list.json";
import { slugifyPubId } from "@/composables/useSuggestedActions";
import SLink from "@/components/SLink.vue";

function termCount(pub: any): number {
  return pub.term_count || 0;
}
</script>
<template>
  <div class="page-head">
    <div class="breadcrumb"><SLink to="/">Registry</SLink> / <span>Publications</span></div>
    <h1>Publications</h1>
    <p class="lede">{{ (publications as any[]).length }} publications referencing OIML concepts.</p>
  </div>

  <section class="card">
    <form class="filter-form" @submit.prevent>
      <span class="muted">{{ (publications as any[]).length }} shown</span>
    </form>
    <div class="table-scroll">
      <table>
      <thead><tr><th>Reference</th><th>Year</th><th>TC/SC</th><th>Terms</th></tr></thead>
      <tbody>
        <tr v-for="p in (publications as any[])" :key="p.id">
          <td><SLink :to="`/publications/${slugifyPubId(p.id)}/`">{{ p.reference || p.id }}</SLink><span v-if="p.withdrawn" class="withdrawn-badge">Withdrawn</span></td>
          <td class="num">{{ (p.id || '').match(/(\d{4})/)?.[1] || "—" }}</td>
          <td><SLink :to="`/tc/${(p.tc_sc || '').toLowerCase().replace('/', '-').toLowerCase()}/`">{{ p.tc_sc || "—" }}</SLink></td>
          <td class="num">{{ termCount(p) }}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </section>
</template>

<style scoped>
.withdrawn-badge {
  display: inline-block;
  margin-left: 0.5em;
  padding: 0.1em 0.45em;
  border-radius: 3px;
  background: var(--status-error-bg);
  color: var(--status-error-text);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid var(--status-error-border);
}
</style>
