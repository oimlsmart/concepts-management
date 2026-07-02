<script setup lang="ts">
import termsData from "../data/terms.json";
import { computed } from "vue";
const terms: any = termsData;
</script>

<template>
  <section class="page-head">
    <div class="breadcrumb"><a href="/">Registry</a> / <span>Divergence leaderboard</span></div>
    <h1>Divergence leaderboard</h1>
    <p class="lede">
      The top 20 terms with the most distinct definitions across the publications
      that use them.
    </p>
  </section>

  <section class="card">
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Term</th>
          <th>Vocabulary</th>
          <th>Instances</th>
          <th>Distinct definitions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, i) in top" :key="t.slug">
          <td class="num">{{ i + 1 }}</td>
          <td><a :href="`/terms/${t.slug}/`">{{ t.name }}</a></td>
          <td><span :class="['kind', `kind-${t.kind}`]">{{ t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—" }}</span></td>
          <td class="num">{{ t.publications.length }}</td>
          <td class="num"><span class="divergence-count">{{ t.distinct }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
