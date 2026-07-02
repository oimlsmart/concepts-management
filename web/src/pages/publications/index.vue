<script setup lang="ts">
import publicationsData from "../../data/publications.json";
import termsData from "../../data/terms.json";
import { ref, computed } from "vue";
const publications: any = publicationsData;
const terms: any = termsData;
</script>

<template>
  <section class="page-head">
    <div class="breadcrumb"><a href="/">Registry</a> / <span>Publications</span></div>
    <h1>OIML publications referenced</h1>
    <p class="lede">
      {{ publications.length }} publications.
      <span v-if="onlyEdition">Showing only terms cited in <strong>{{ onlyEdition }}</strong>.</span>
    </p>
  </section>

  <section class="card">
    <form class="filter-form" @submit.prevent>
      <label>Show terms from edition:
        <select v-model="onlyEdition">
          <option value="">All editions</option>
          <option value="2010">2010 only</option>
          <option value="202X">202X only</option>
        </select>
      </label>
      <span class="count-line">Showing {{ filtered.length }} publication{{ filtered.length === 1 ? "" : "s" }}{{ onlyEdition ? ` cited in ${onlyEdition}` : "" }}.</span>
    </form>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Reference</th>
          <th>Year</th>
          <th>TC/SC</th>
          <th>Terms (this edition)</th>
          <th>PDF</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id + (onlyEdition || '')">
          <td><code>{{ p.id }}</code></td>
          <td><a :href="`/publications/${p.id}/`">{{ p.reference || p.id }}</a></td>
          <td class="num">{{ (p.id || '').match(/(\d{4})/)?.[1] || "—" }}</td>
          <td>{{ p.tc_sc || "—" }}</td>
          <td class="num">{{ termCount(p.id, onlyEdition) }}</td>
          <td><a v-if="p.link" class="external" :href="p.link">PDF ↗</a></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
