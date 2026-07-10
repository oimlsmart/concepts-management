<script setup lang="ts">
// Renders definition/designation text that may contain:
//   1. VIM cross-references: {{3.1,measuring instrument}} → clickable link
//   2. Pre-rendered MathML: <math>...</math> → displayed as-is (v-html)
//
// MathML is pre-rendered by Plurimath (Ruby) at export time; the frontend
// just renders it via v-html. Cross-references are converted client-side
// using the VIM concept ID to look up the correct G 18 term slug.
import { computed } from "vue";
import termBySlug from "@/data/term-by-slug.json";

const props = defineProps<{ text: string }>();
const base = import.meta.env.BASE_URL;

// Build lookups for resolving cross-reference slugs.
// VIM concept IDs change between editions (VIM 1993 #4.1 → VIM 2012 #3.1),
// so we also match by term name with singular/plural normalization.
const conceptIdLookup: Record<string, string> = {};
const nameLookup: Record<string, string> = {};
for (const [slug, term] of Object.entries(termBySlug as any)) {
  const id = term.official_concept?.id;
  if (id && !conceptIdLookup[id]) conceptIdLookup[id] = slug;
  if (term.name) nameLookup[term.name.toLowerCase()] = slug;
}

function singularize(s: string): string {
  if (s.endsWith("ies")) return s.slice(0, -3) + "y";
  if (s.endsWith("s")) return s.slice(0, -1);
  return s;
}

function slugifyText(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const allSlugs = new Set(Object.keys(termBySlug));

function resolveXrefSlug(conceptId: string, text: string): string | null {
  // Strategy 1: concept-ID lookup
  if (conceptIdLookup[conceptId]) return conceptIdLookup[conceptId];
  const lower = text.trim().toLowerCase();
  // Strategy 2: exact name match
  if (nameLookup[lower]) return nameLookup[lower];
  // Strategy 3: singularized name match
  const singular = singularize(lower);
  if (nameLookup[singular]) return nameLookup[singular];
  // Strategy 4: slugify and check if it exists
  const textSlug = slugifyText(text);
  if (allSlugs.has(textSlug)) return textSlug;
  // No matching G 18 term — return null so caller renders plain text
  return null;
}

const rendered = computed(() => {
  if (!props.text) return "";
  let html = props.text;
  html = html.replace(
    /\{\{([^,}]+),([^}]+)\}\}/g,
    (_match: string, id: string, text: string) => {
      const trimmedText = text.trim();
      const slug = resolveXrefSlug(id.trim(), trimmedText);
      if (slug) {
        return `<a href="${base}terms/${slug}/" class="xref">${trimmedText}</a>`;
      }
      return `<span class="xref-unresolved" title="Not in G 18 — see VIM/VIML vocab">${trimmedText}</span>`;
    }
  );
  return html;
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- pre-rendered MathML + linkified cross-refs. No user input. -->
  <span class="def-text" v-html="rendered" />
</template>

<style scoped>
.def-text { white-space: pre-wrap; }
.def-text :deep(math) { font-size: 1.05em; }
.def-text :deep(.xref) {
  border-bottom: 1px dotted currentColor;
  font-weight: 500;
  color: var(--color-accent);
  text-decoration: none;
}
.def-text :deep(.xref:hover) {
  border-bottom-style: solid;
  text-decoration: none;
}
.def-text :deep(.xref-unresolved) {
  border-bottom: 1px dotted var(--color-ink-muted);
  color: var(--color-ink-soft);
  font-style: italic;
  cursor: help;
}
</style>
