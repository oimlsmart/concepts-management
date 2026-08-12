<script setup lang="ts">
import { computed } from "vue";
import { resolveXrefSlug } from "@/utils/xref-resolver";

const props = defineProps<{ text: string }>();
const base = import.meta.env.BASE_URL;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// MathML is emitted by the data pipeline from VIM/VIML definitions —
// pre-rendered, not user input. We let math blocks through but escape
// everything else, so a compromised pipeline still can't inject <script>
// or arbitrary HTML outside <math>…</math>.
const MATHML_RE = /<math[\s>][\s\S]*?<\/math>/gi;

const rendered = computed(() => {
  if (!props.text) return "";

  const slots: string[] = [];
  const slot = (html: string) => {
    const i = slots.push(html) - 1;
    return ` ${i} `;
  };

  const withMathSlots = props.text.replace(MATHML_RE, (m) => slot(m));

  const withMustacheSlots = withMathSlots.replace(
    /\{\{\s*([^,}]+?),\s*([^}]+?)\s*\}\}/g,
    (_m: string, id: string, text: string) => {
      const trimmedText = text.trim();
      const slug = resolveXrefSlug(id.trim(), trimmedText);
      const safeDisplay = escapeHtml(trimmedText);
      const safe = slug
        ? `<a href="${base}concepts/${encodeURIComponent(slug)}/" class="xref">${safeDisplay}</a>`
        : `<span class="xref-unresolved" title="Not in G 18 — see VIM/VIML vocab">${safeDisplay}</span>`;
      return slot(safe);
    }
  );

  return escapeHtml(withMustacheSlots).replace(/ (\d+) /g, (_m, i) => slots[Number(i)]);
});
</script>

<template>
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
