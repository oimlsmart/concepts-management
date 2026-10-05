<script setup lang="ts">
interface Recommendation {
  level: "ok" | "warn" | "info" | "none";
  icon: string;
  text: string;
  link: string | null;
  action: string;
}

const emit = defineEmits<{ action: [recommendation: Recommendation] }>();
defineProps<{ recommendation: Recommendation }>();
</script>

<template>
  <div :class="['recommendations-banner', `rec-${recommendation.level}`]" :role="recommendation.level === 'none' ? undefined : 'status'">
    <span class="rec-icon" aria-hidden="true">{{ recommendation.icon }}</span>
    <div class="rec-body">
      <div class="rec-label">Recommendation</div>
      <div class="rec-text">{{ recommendation.text }}</div>
    </div>
    <button v-if="recommendation.action" type="button" class="rec-action" @click="emit('action', recommendation)">
      {{ recommendation.action }} →
    </button>
  </div>
</template>

<style scoped>
.recommendations-banner {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.7em 1em;
  margin-bottom: 1.2em;
  border-radius: 6px;
  border-left: 4px solid;
}
.rec-ok   { background: var(--status-ok-bg);   border-color: var(--status-ok-border); }
.rec-warn { background: var(--status-warn-bg); border-color: var(--status-warn-border); }
.rec-info { background: var(--status-info-bg); border-color: var(--status-info-border); }
.rec-none { display: none; }
.rec-icon { font-size: 1.3rem; flex-shrink: 0; }
.rec-body { flex: 1; }
.rec-label {
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
  margin-bottom: 0.1em;
}
.rec-text { font-size: 0.88rem; line-height: 1.4; }
.rec-action {
  flex-shrink: 0;
  padding: 0.35em 0.8em;
  border-radius: 4px;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  appearance: none;
  border: 0;
  cursor: pointer;
  font-family: inherit;
}
.rec-action:hover { background: var(--color-accent-hover); }
</style>
