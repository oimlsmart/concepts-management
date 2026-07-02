<script setup lang="ts">
import conflictsData from "../data/conflicts.json";
const conflicts: any = conflictsData;
</script>

<template>
  <section class="page-head">
    <div class="breadcrumb"><a href="/">Registry</a> / <span>ID conflicts</span></div>
    <h1>Conflicting G 18 IDs</h1>
    <p class="lede">
      Two views of the G 18 ID space:
      <em>raw conflicts</em> (same ID assigned to two distinct concepts in the source)
      and <em>designation collisions</em> (same concept cited under multiple distinct IDs).
    </p>
  </section>

  <section class="card">
    <h2>Raw ID conflicts</h2>
    <p class="lede">
      A raw conflict means the source publication used the same G 18 ID number
      for two semantically different concepts. Resolved in the source YAML via
      the <code>&lt;id&gt;a</code> / <code>&lt;id&gt;b</code> split convention.
    </p>
    <p v-if="!Object.keys(conflicts.raw || {}).length || !Object.values(conflicts.raw || {}).flat().length" class="ok">No raw ID conflicts detected in either edition. ✓</p>
    <template v-else>
      <div v-for="(list, edition) in conflicts.raw" :key="edition">
        <h3 v-if="list.length">{{ edition }} ({{ list.length }} conflicting IDs)</h3>
        <table v-if="list.length" class="conflicts-table">
          <thead><tr><th>Base ID</th><th>Distinct concepts</th></tr></thead>
          <tbody>
            <tr v-for="c in list" :key="c.id">
              <td class="num"><code>{{ c.id }}</code></td>
              <td>
                <ul class="conflict-concepts">
                  <li v-for="con in c.concepts" :key="con.designation + con.source">
                    <span :class="['edition-pill', `edition-${edition.toLowerCase()}`]">{{ edition }}</span>
                    <strong>{{ con.designation }}</strong>
                    <span class="conflict-source">from {{ con.source }}</span>
                    <span class="conflict-raw-id">(raw ID: <code>{{ con.raw_id }}</code>)</span>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>

  <section class="card">
    <h2>Designation collisions (top 30 per edition)</h2>
    <p class="lede">
      A designation collision means the same term appears under multiple distinct
      G 18 IDs in the source. TC 1 must decide which ID is canonical in 202X.
    </p>
    <div v-for="(list, edition) in conflicts.designation_collisions" :key="edition">
      <h3 v-if="list.length">{{ edition }} — top {{ list.length }}</h3>
      <table v-if="list.length" class="collisions-table">
        <thead><tr><th>Designation</th><th>Distinct IDs</th><th>Publications</th></tr></thead>
        <tbody>
          <tr v-for="c in list" :key="c.designation">
            <td>
              <a :href="`/terms/${c.designation.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/`">{{ c.designation }}</a>
            </td>
            <td class="num">{{ c.ids.length }}</td>
            <td class="num">{{ c.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
