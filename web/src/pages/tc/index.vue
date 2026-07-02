<script setup lang="ts">
import tcData from "../../data/tc.json";
import termsData from "../../data/terms.json";
const tcs: any = tcData;
const terms: any = termsData;
</script>

<template>
  <section class="page-head">
    <div class="breadcrumb"><a href="/">Registry</a> / <span>TC / SC</span></div>
    <h1>Technical Committees &amp; Subcommittees</h1>
  </section>

  <section class="card">
    <table>
      <thead>
        <tr>
          <th>TC / SC</th>
          <th>Publications</th>
          <th>Terms</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in tcs" :key="t">
          <td><a :href="`/tc/${slug(t)}/`">{{ t }}</a></td>
          <td class="num">{{ pubCount(t) }}</td>
          <td class="num">{{ termCount(t) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
