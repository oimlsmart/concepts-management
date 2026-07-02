<script setup lang="ts">
import tcData from "../../data/tc.json";
import termsData from "../../data/terms.json";
import { useRoute } from "vue-router";
import { computed } from "vue";
const tcs: any = tcData;
const terms: any = termsData;
</script>

<template>
  <section v-if="!tcName" class="card"><p>TC/SC not found.</p></section>
  <template v-else>
    <section class="page-head">
      <div class="breadcrumb">
        <a href="/">Registry</a> /
        <a href="/tc/">TC / SC</a> /
        <span>{{ tcName }}</span>
      </div>
      <h1>{{ tcName }}</h1>
      <p class="lede">{{ terms.length }} term{{ terms.length === 1 ? "" : "s" }} cited by this TC/SC's publications.</p>
    </section>

    <section class="card">
      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Vocabulary</th>
            <th>Ed.</th>
            <th>Instances</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in terms" :key="t.slug">
            <td><a :href="`/terms/${t.slug}/`">{{ t.name }}</a></td>
            <td><span :class="['kind', `kind-${t.kind}`]">{{ t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—" }}</span></td>
            <td>
              <span v-for="e in t.editions_present" :key="e" :class="['edition-pill', `edition-${e.toLowerCase()}`]">{{ e }}</span>
            </td>
            <td class="num">{{ t.publications.filter((p: any) => p.tc_sc === tcName).length }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </template>
</template>
