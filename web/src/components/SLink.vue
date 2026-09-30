<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ to: string }>();
const base = import.meta.env.BASE_URL;
// Must be computed so href stays in sync when the parent's `to` prop
// changes (e.g. when list items re-render after a filter/scope change).
const href = computed(() => base + props.to.replace(/^\//, ""));
</script>
<template>
  <a :href="href"><slot /></a>
</template>
