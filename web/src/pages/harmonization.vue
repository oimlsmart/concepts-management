<script setup lang="ts">
import harmonizationData from "../data/harmonization.json";
const candidates: any = harmonizationData;
</script>

<template>
  <section class="page-head">
    <div class="breadcrumb"><a href="/">Registry</a> / <span>Harmonisation worklist</span></div>
    <h1>Harmonisation worklist</h1>
    <p class="lede">
      Every term cited by <strong>two or more distinct OIML publications</strong>,
      where the publications may use divergent definitions. This is the core
      worklist for TC 1 validating the 202X edition.
    </p>
    <p class="lede">
      <strong>{{ candidates.length }}</strong> candidates shown (top 200 by publication count).
    </p>
  </section>

  <section class="card">
    <table class="harmonization-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Term</th>
          <th>VIM/VIML</th>
          <th>Ed.</th>
          <th>Inst.</th>
          <th>Distinct defs</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, i) in candidates" :key="t.slug">
          <td class="num">{{ i + 1 }}</td>
          <td><a :href="`/terms/${t.slug}/`">{{ t.name }}</a></td>
          <td><span :class="['kind', `kind-${t.kind}`]">{{ t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—" }}</span></td>
          <td>
            <span v-for="e in t.editions_present" :key="e" :class="['edition-pill', `edition-${e.toLowerCase()}`]">{{ e }}</span>
          </td>
          <td class="num">{{ t.publications.length }}</td>
          <td class="num">{{ new Set(t.publications.map((p: any) => (p.definition || '').trim()).filter(Boolean)).size }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="card note">
    <h2>How to use this worklist</h2>
    <ol>
      <li><strong>Pick a term</strong> with a high "Distinct defs" count.</li>
      <li><strong>Open the term page</strong> to read each publication's definition side-by-side.</li>
      <li><strong>Decide:</strong> converge on a single definition? If yes, propose it in the 202X YAML.</li>
      <li><strong>Submit changes</strong> to <code>oimlsmart/vocab datasets/g18-202X/</code>.</li>
    </ol>
  </section>
</template>
