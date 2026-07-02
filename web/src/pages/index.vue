<script setup lang="ts">
import terms from "@/data/terms.json";
import harmonization from "@/data/harmonization.json";
import editionStats from "@/data/edition-stats.json";

const totalInstances = terms.reduce((s: number, t: any) => s + t.publications.length, 0);
const divergentCount = terms.filter((t: any) => new Set(t.publications.map((p: any) => (p.definition || '').trim()).filter(Boolean)).size > 1).length;
</script>

<template>
  <section class="hero">
    <h1>G 18 — OIML Term-Usage Registry</h1>
    <p class="lede">
      A <strong>usage registry</strong> for TC 1 / Vocabularies to validate
      <a href="https://github.com/oimlsmart/vocab/tree/main/datasets/g18-202X">OIML G 18:202X</a>.
    </p>
  </section>

  <section class="grid grid-4">
    <RouterLink class="stat-card" to="/terms/"><div class="stat-value">{{ terms.length }}</div><div class="stat-label">unique terms</div></RouterLink>
    <RouterLink class="stat-card" to="/harmonization/"><div class="stat-value">{{ harmonization.length }}</div><div class="stat-label">harmonisation candidates</div></RouterLink>
    <RouterLink class="stat-card" to="/editions/"><div class="stat-value">{{ totalInstances }}</div><div class="stat-label">instances</div></RouterLink>
    <RouterLink class="stat-card" to="/leaderboard/"><div class="stat-value">{{ divergentCount }}</div><div class="stat-label">divergent terms</div></RouterLink>
  </section>

  <section class="card">
    <h2>Edition comparison</h2>
    <table>
      <thead><tr><th>Edition</th><th>Concepts</th><th>Terms</th><th>Only here</th><th>Harmonise</th></tr></thead>
      <tbody>
        <tr v-for="s in editionStats.stats" :key="s.edition">
          <td><strong>{{ s.edition }}</strong> <span v-if="s.primary" class="match-status match-status-full">primary</span></td>
          <td class="num">{{ s.instances }}</td><td class="num">{{ s.terms }}</td>
          <td class="num">{{ s.only_in_edition }}</td><td class="num">{{ s.harmonization_candidates }}</td>
        </tr>
      </tbody>
    </table>
    <p style="margin-top:0.7em"><RouterLink to="/editions/">Full comparison →</RouterLink></p>
  </section>

  <section class="card">
    <h2>Start browsing</h2>
    <ul>
      <li><RouterLink to="/terms/">All terms</RouterLink> — {{ terms.length }} entries</li>
      <li><RouterLink to="/harmonization/">Harmonisation worklist</RouterLink> — TC 1 validation</li>
      <li><RouterLink to="/editions/">Edition comparison</RouterLink> — 2010 vs 202X</li>
      <li><RouterLink to="/conflicts/">ID conflicts</RouterLink> — raw conflicts + collisions</li>
      <li><RouterLink to="/leaderboard/">Divergence leaderboard</RouterLink></li>
    </ul>
  </section>
</template>
