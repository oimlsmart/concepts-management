<script setup lang="ts">
const props = defineProps<{
  kind: string;
  isCurrent: boolean;
  isSuperseded: boolean;
  latestCheckFound: boolean | null;
  hasNearMiss: boolean;
  hasWithdrawn: boolean;
}>();

const isVim = props.kind !== "oiml_original" && props.kind !== "undefined";

interface Step { label: string; type: "entry" | "decision" | "done" | "warn" | "action" | "danger"; }

const steps: Step[] = (() => {
  const s: Step[] = [{ label: "Term in OIML pubs", type: "entry" }];

  if (props.hasWithdrawn) {
    s.push({ label: "In withdrawn pub?", type: "danger" });
    s.push({ label: "Retire from G 18", type: "action" });
    return s;
  }

  if (isVim) {
    s.push({ label: "Cites VIM/VIML", type: "decision" });
    if (props.isCurrent) {
      s.push({ label: "Citation current", type: "decision" });
      s.push({ label: "Nothing to do", type: "done" });
    } else if (props.latestCheckFound === true) {
      s.push({ label: "Outdated citation", type: "warn" });
      s.push({ label: "Still in latest", type: "decision" });
      s.push({ label: "Update resolves it", type: "done" });
    } else if (props.latestCheckFound === false) {
      s.push({ label: "Outdated citation", type: "warn" });
      s.push({ label: "Removed from latest", type: "decision" });
      s.push({ label: "Propose V 1/V 2/V 3", type: "action" });
    } else {
      s.push({ label: "Check citation status", type: "decision" });
    }
  } else {
    s.push({ label: "Not in VIM/VIML", type: "decision" });
    if (props.hasNearMiss) {
      s.push({ label: "Near-miss found", type: "decision" });
      s.push({ label: "Adopt V 1/V 2 or propose V 3", type: "action" });
    } else {
      s.push({ label: "No near-miss", type: "decision" });
      s.push({ label: "Propose for V 3", type: "action" });
    }
  }
  return s;
})();
</script>

<template>
  <div class="flow-chain">
    <template v-for="(step, i) in steps" :key="i">
      <span :class="['flow-step', `flow-${step.type}`]">{{ step.label }}</span>
      <span v-if="i < steps.length - 1" class="flow-arrow" aria-hidden="true">→</span>
    </template>
  </div>
</template>

<style scoped>
.flow-chain {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3em;
  margin: 0.5em 0;
}
.flow-step {
  display: inline-block;
  padding: 0.25em 0.7em;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1.5px solid;
}
.flow-entry {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}
.flow-decision {
  background: var(--color-paper-tint);
  border-color: var(--color-ink-muted);
  color: var(--color-ink);
}
.flow-done {
  background: var(--status-ok-bg);
  border-color: var(--status-ok-border);
  color: var(--status-ok-text);
}
.flow-warn {
  background: var(--status-warn-bg);
  border-color: var(--status-warn-border);
  color: var(--status-warn-text);
}
.flow-danger {
  background: var(--status-error-bg);
  border-color: var(--status-error-border);
  color: var(--status-error-text);
}
.flow-action {
  background: var(--status-info-bg);
  border-color: var(--status-info-border);
  color: var(--status-info-text);
}
.flow-arrow {
  color: var(--color-ink-muted);
  font-size: 0.85rem;
  font-weight: 400;
}
</style>
