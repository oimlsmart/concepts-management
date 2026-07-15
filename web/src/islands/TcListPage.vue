<script setup lang="ts">
import tcData from "@/data/tc.json";
import tcStats from "@/data/tc-stats.json";
import SLink from "@/components/SLink.vue";

// Build a lookup map from tc-stats.json for O(1) access.
const statsMap: Record<string, any> = {};
for (const s of tcStats as any[]) {
  statsMap[s.tc] = s;
}

function termCount(tcName: string): number {
  const s = statsMap[tcName];
  return s ? s.terms_total : 0;
}

function pubCount(tcName: string): number {
  const s = statsMap[tcName];
  return s ? s.pubs_total : 0;
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
</script>

<template>
  <div class="page-head">
    <div class="breadcrumb"><SLink to="/">Registry</SLink> / <span>TC / SC</span></div>
    <h1>Technical Committees</h1>
    <p class="lede">{{ (tcData as string[]).length }} subcommittees referencing OIML concepts.</p>
  </div>

  <section class="card">
    <div class="table-scroll">
      <table>
      <thead><tr><th>TC / SC</th><th>Publications</th><th>Terms</th></tr></thead>
      <tbody>
        <tr v-for="t in (tcData as string[])" :key="t">
          <td><SLink :to="`/tc/${slug(t)}/`">{{ t }}</SLink></td>
          <td class="num">{{ pubCount(t) }}</td>
          <td class="num">{{ termCount(t) }}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </section>
</template>
