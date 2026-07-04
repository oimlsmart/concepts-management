<script setup lang="ts">
// Renders a designation that may contain stem:[<asciimath>] math markup.
// Temml converts the inner expression to MathML; the original stem:[...]
// is preserved as a `title` tooltip so editors can see the source.
import { computed } from "vue";
import temml from "temml";

const props = defineProps<{ text: string }>();

const segments = computed(() => {
  // Split on stem:[...] blocks; pass-through everything else as text.
  const out: { kind: "text" | "math"; value: string }[] = [];
  const re = /stem:\[([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(props.text)) !== null) {
    if (m.index > last) out.push({ kind: "text", value: props.text.slice(last, m.index) });
    out.push({ kind: "math", value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < props.text.length) out.push({ kind: "text", value: props.text.slice(last) });
  return out;
});

function render(value: string): string {
  try {
    return temml.renderToString(value, { displayMode: false, throwOnError: false });
  } catch {
    return value;
  }
}
</script>

<template>
  <span class="math-symbol">
    <template v-for="(seg, i) in segments" :key="i">
      <span v-if="seg.kind === 'text'">{{ seg.value }}</span>
      <!-- eslint-disable-next-line vue/no-v-html -- temml output is safe (MathML) -->
      <span v-else class="math-segment" :title="`stem:[${seg.value}]`" v-html="render(seg.value)" />
    </template>
  </span>
</template>

<style scoped>
.math-symbol { white-space: nowrap; }
.math-segment { display: inline-block; }
.math-segment math { font-size: 1.05em; }
</style>
