<script setup lang="ts">
import editionStatsData from "../data/edition-stats.json";
const editions: any = editionStatsData;
</script>

<template>
  <section class="page-head">
    <div class="breadcrumb"><a href="/">Registry</a> / <span>Edition comparison</span></div>
    <h1>G 18 edition comparison</h1>
    <p class="lede">
      Side-by-side view of <strong>OIML G 18:2010</strong> (the published edition)
      and <strong>OIML G 18:202X</strong> (the draft edition currently being
      validated by TC 1 / Vocabularies).
    </p>
  </section>

  <section class="card">
    <h2>Headline numbers</h2>
    <table class="editions-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th v-for="ed in editions.editions" :key="ed">{{ ed }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Source concept entries</td>
          <td v-for="s in editions.stats" :key="s.edition" class="num">{{ s.instances }}</td>
        </tr>
        <tr>
          <td>Unique terms (after merging by designation)</td>
          <td v-for="s in editions.stats" :key="s.edition" class="num">{{ s.terms }}</td>
        </tr>
        <tr>
          <td>Terms only in this edition</td>
          <td v-for="s in editions.stats" :key="s.edition" class="num">{{ s.only_in_edition }}</td>
        </tr>
        <tr>
          <td>Harmonisation candidates (≥ 2 distinct source publications)</td>
          <td v-for="s in editions.stats" :key="s.edition" class="num">{{ s.harmonization_candidates }}</td>
        </tr>
      </tbody>
    </table>
    <p class="muted" style="margin-top: 0.7em; font-size: 0.88em;">
      Shared across both editions: <strong>{{ editions.terms_in_both }}</strong> terms.
    </p>
  </section>

  <section class="card">
    <h2>What changed between editions</h2>
    <ul>
      <li><a href="/harmonization/">Harmonisation worklist for TC 1 →</a></li>
      <li><a :href="`/terms/?only=2010`">Terms present in 2010 but missing from 202X →</a></li>
      <li><a :href="`/terms/?only=202X`">Terms added in 202X (not in 2010) →</a></li>
      <li><a href="/conflicts/">Conflicting G 18 IDs →</a></li>
    </ul>
  </section>

  <section class="card note">
    <h2>How to read this</h2>
    <p>
      The 202X edition is currently a <strong>draft</strong>. TC 1's task is to
      confirm that each term in 202X either (a) carries a single harmonised
      definition backed by VIM/VIML where applicable, or (b) documents the
      intentional divergence across OIML Recommendations.
    </p>
  </section>
</template>
