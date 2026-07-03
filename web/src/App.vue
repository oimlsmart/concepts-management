<script setup lang="ts">
import { ref, onMounted } from "vue";

const base = import.meta.env.BASE_URL;
const logoSrc = `${base}oiml-logo.svg`;

// Three groups, ordered by user task:
//   Triage  — what TC 1 needs to work on
//   Browse  — explore the registry
//   Dataset — structural issues / edition diff
const navGroups: { items: { href: string; label: string }[] }[] = [
  {
    items: [
      { href: "actions/", label: "Actions" },
      { href: "harmonization/", label: "Harmonise" },
    ],
  },
  {
    items: [
      { href: "terms/", label: "Terms" },
      { href: "publications/", label: "Publications" },
      { href: "tc/", label: "TC / SC" },
    ],
  },
  {
    items: [
      { href: "conflicts/", label: "ID Conflicts" },
      { href: "editions/", label: "Editions" },
    ],
  },
];

// Mobile hamburger state. Defaults to `false` so SSR and client agree.
const menuOpen = ref(false);

function closeMenu() { menuOpen.value = false; }

// Close the menu if the viewport grows back to desktop size.
onMounted(() => {
  const mq = window.matchMedia("(min-width: 880px)");
  const handler = (e: MediaQueryListEvent) => { if (e.matches) closeMenu(); };
  mq.addEventListener("change", handler);
});
</script>

<template>
  <header class="site-header">
    <div class="container header-bar">
      <a class="brand" :href="base" @click="closeMenu">
        <img :src="logoSrc" alt="OIML" class="brand-mark-img" />
        <span class="brand-sub">
          <span class="brand-sub-title">G 18 Registry</span>
          <span class="brand-sub-tag">OIML Term-Usage Registry</span>
        </span>
      </a>
      <button
        class="nav-toggle"
        :class="{ 'is-open': menuOpen }"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>
      <nav class="site-nav" :class="{ 'is-open': menuOpen }" aria-label="Primary">
        <template v-for="(group, gi) in navGroups" :key="gi">
          <span v-if="gi > 0" class="nav-sep" aria-hidden="true"></span>
          <a v-for="n in group.items" :key="n.href" :href="base + n.href" @click="closeMenu">{{ n.label }}</a>
        </template>
      </nav>
    </div>
  </header>
  <main class="container main">
    <RouterView />
  </main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <strong>G 18 — OIML Term-Usage Registry</strong><br />
        Source: <a href="https://github.com/oimlsmart/vocab/tree/main/datasets/g18-2010">oimlsmart/vocab</a>.
        VIM/VIML: <a href="https://oimlsmart.github.io/vocab/">oimlsmart.github.io/vocab</a>.
      </div>
      <div class="footer-attribution">
        <strong>OIML SMART.</strong> Digital service by <a href="https://www.ribose.com">Ribose</a>.
      </div>
    </div>
  </footer>
</template>

<style>
@import "./styles/global.css";
@import "./styles/components.css";
</style>
