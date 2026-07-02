<script setup lang="ts">
import conflictsData from "@/data/conflicts.json";
</script>
<template>
  <div class="page-head">
    <div class="breadcrumb"><RouterLink to="/">Registry</RouterLink> / <span>ID Conflicts</span></div>
    <h1>Conflicting G 18 IDs</h1>
    <p class="lede">Raw ID conflicts (same ID for distinct concepts) and designation collisions (same concept, multiple IDs).</p>
  </div>
  <section class="card">
    <h2>Raw ID conflicts</h2>
    <p v-if="!Object.keys(conflictsData.raw || {}).length" class="muted">None detected. ✓</p>
    <div v-for="(list, ed) in conflictsData.raw" :key="ed">
      <h3 v-if="list.length">{{ ed }} ({{ list.length }})</h3>
      <table v-if="list.length">
        <thead><tr><th>ID</th><th>Concepts</th></tr></thead>
        <tbody>
          <tr v-for="c in list" :key="c.id">
            <td><code>{{ c.id }}</code></td>
            <td><div v-for="con in c.concepts" :key="con.designation"><strong>{{ con.designation }}</strong> ({{ con.source }}) <code>{{ con.raw_id }}</code></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section class="card">
    <h2>Designation collisions (top 30)</h2>
    <div v-for="(list, ed) in conflictsData.designation_collisions" :key="ed">
      <h3 v-if="list.length">{{ ed }}</h3>
      <table v-if="list.length">
        <thead><tr><th>Designation</th><th>IDs</th><th>Pubs</th></tr></thead>
        <tbody>
          <tr v-for="c in list.slice(0, 30)" :key="c.designation">
            <td><RouterLink :to="`/terms/${c.designation.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/`">{{ c.designation }}</RouterLink></td>
            <td class="num">{{ c.ids.length }}</td>
            <td class="num">{{ c.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
