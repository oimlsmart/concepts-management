<script setup lang="ts">
import publicationsData from "../../data/publications.json";
import termsData from "../../data/terms.json";
import { useRoute } from "vue-router";
import { computed } from "vue";
const publications: any = publicationsData;
const terms: any = termsData;
</script>

<template>
  <section v-if="!pub" class="card"><p>Publication not found.</p></section>
  <template v-else>
    <section class="page-head">
      <div class="breadcrumb">
        <a href="/">Registry</a> /
        <a href="/publications/">Publications</a> /
        <span>{{ pub.reference || pub.id }}</span>
      </div>
      <h1>{{ pub.reference || pub.id }}</h1>
      <p class="lede">
        {{ yearFromId(pub.id) }} ·
        <a v-if="pub.tc_sc" :href="`/tc/${pub.tc_sc}/`">{{ pub.tc_sc }}</a>
        <span v-else class="muted">TC/SC unattributed</span>
        <a v-if="pub.link" class="pdf-link" :href="pub.link"> · PDF ↗</a>
      </p>
    </section>

    <section class="card">
      <h2>Terms defined in this publication ({{ terms.length }})</h2>
      <table v-if="terms.length">
        <thead>
          <tr>
            <th>Term</th>
            <th>Vocabulary</th>
            <th>Ed.</th>
            <th>Definition (verbatim)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in terms" :key="t.slug">
            <td><a :href="`/terms/${t.slug}/`">{{ t.name }}</a></td>
            <td><span :class="['kind', `kind-${t.kind}`]">{{ t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—" }}</span></td>
            <td>
              <span v-for="e in t.editions_present" :key="e" :class="['edition-pill', `edition-${e.toLowerCase()}`]">{{ e }}</span>
            </td>
            <td class="definition">
              <div class="def-text">{{ t.publications.find((p: any) => p.publication_id === pubId.value)?.definition || "(no definition)" }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="muted">No terms recorded for this publication.</p>
    </section>
  </template>
</template>
