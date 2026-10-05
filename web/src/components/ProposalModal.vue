<script setup lang="ts">
// Vocabulary-proposal modal. Used by:
//  - ProposalsPage (gap analysis): opens from the "Propose" buttons in the
//    gaps table, or auto-opens from ?term= on the URL.
//  - TermDetailPage: opens from the decision flow buttons (Adopt V 1/V 2 /
//    Propose V 3) without leaving the page.
//
// Parents call modalRef.value.open(gap, explicitTarget?) to open it.
// `explicitTarget` overrides the auto-detected default (V1 if VIML
// near-miss, V2 if VIM near-miss, V3 otherwise) so each caller's button
// can carry its own intent.

import { ref, computed, nextTick, onUnmounted } from "vue";
import {
  composeIssueBody,
  composeIssueUrl,
  composeIssueTitle,
  TARGET_CATEGORIES,
  type ProposalTarget,
  type ProposalDraft,
} from "@/composables/useGapProposal";
import type { VocabGap } from "@/composables/useVocabGaps";

const openGap = ref<VocabGap | null>(null);
const proposalTarget = ref<ProposalTarget>("V3");
const proposalRationale = ref("");
const proposalAuthor = ref("");
const generating = ref(false);
const issueUrl = ref<string | null>(null);

// Modal focus management — trap Tab inside the dialog, restore focus on close.
const modalEl = ref<HTMLElement | null>(null);
let lastFocused: HTMLElement | null = null;

function focusableIn(el: HTMLElement | null): HTMLElement[] {
  if (!el) return [];
  return Array.from(el.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )).filter(e => e.offsetParent !== null);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    close();
    return;
  }
  if (e.key === "Tab" && modalEl.value) {
    const items = focusableIn(modalEl.value);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function open(g: VocabGap, explicitTarget: ProposalTarget | null = null) {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    lastFocused = document.activeElement;
  }
  openGap.value = g;
  // Default target: if any near-miss exists, lean toward reconcile (V1/V2).
  // Otherwise default to V 3 (specific term). explicitTarget overrides this
  // — used by the term detail page's decision buttons.
  const nm = g.near_misses.viml || g.near_misses.vim;
  proposalTarget.value = explicitTarget ?? (nm ? (g.near_misses.viml ? "V1" : "V2") : "V3");
  proposalRationale.value = nm
    ? `The G 18 term "${g.name}" appears related to ${nm.latest_label} "${nm.designation}" (concept ${nm.concept_id}). Decide: re-link to ${nm.latest_label}, document as a deliberate OIML-specific variant (candidate for V 3), or confirm OIML as authoritative.`
    : `The G 18 term "${g.name}" has no VIM/VIML equivalent. It appears to be a specific term used across ${g.publications.length} OIML publication(s). Propose for inclusion in V 3 (specific terms).`;
  issueUrl.value = null;
  document.addEventListener("keydown", onKeydown);
  nextTick(() => {
    const first = focusableIn(modalEl.value)[0];
    if (first) first.focus();
    else modalEl.value?.focus();
  });
}

function close() {
  openGap.value = null;
  issueUrl.value = null;
  document.removeEventListener("keydown", onKeydown);
  if (lastFocused) lastFocused.focus();
}

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});

async function submit() {
  if (!openGap.value) return;
  generating.value = true;
  try {
    const draft: ProposalDraft = {
      gap: openGap.value,
      target: proposalTarget.value,
      rationale: proposalRationale.value,
      author: proposalAuthor.value || undefined,
    };
    const body = await composeIssueBody(draft);
    issueUrl.value = composeIssueUrl(draft, body);
    if (typeof window !== "undefined") {
      window.open(issueUrl.value, "_blank", "noopener");
    }
  } finally {
    generating.value = false;
  }
}

const issueTitlePreview = computed(() =>
  openGap.value ? composeIssueTitle({ gap: openGap.value, target: proposalTarget.value, rationale: "" }) : ""
);

defineExpose({ open, close });
</script>

<template>
  <div v-if="openGap" class="modal-backdrop" @click.self="close">
    <div ref="modalEl" class="modal" role="dialog" aria-modal="true" aria-labelledby="proposal-modal-title" tabindex="-1">
      <div class="modal-head">
        <h2 id="proposal-modal-title">Propose vocabulary placement</h2>
        <button type="button" class="modal-close" @click="close" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        <p class="modal-term">
          <strong>{{ openGap.name }}</strong>
          <span class="muted"> · {{ openGap.publications.length }} pubs</span>
        </p>

        <fieldset class="proposal-target">
          <legend>Classify this term</legend>
          <label v-for="cat in TARGET_CATEGORIES" :key="cat.code" :class="['proposal-target-option', { 'proposal-target-selected': proposalTarget === cat.code }]">
            <input type="radio" name="proposal-target" :value="cat.code" v-model="proposalTarget" />
            <span class="proposal-target-text">
              <span class="proposal-target-concept">{{ cat.concept }}</span>
              <span class="proposal-target-arrow">→</span>
              <span class="proposal-target-vocab">{{ cat.target }}</span>
              <span class="proposal-target-examples">{{ cat.examples }}</span>
            </span>
          </label>
        </fieldset>

        <label class="proposal-field">
          <span>Rationale</span>
          <textarea v-model="proposalRationale" rows="6"></textarea>
        </label>

        <label class="proposal-field">
          <span>Your name (optional, for the proposed_by field)</span>
          <input v-model="proposalAuthor" type="text" placeholder="e.g. Jane Doe" />
        </label>

        <p class="modal-issue-preview">
          <strong>Issue title:</strong> {{ issueTitlePreview }}
        </p>

        <p v-if="issueUrl" class="modal-success">
          Opened in a new tab. If it didn't open,
          <a :href="issueUrl" target="_blank" rel="noopener">click here</a>.
        </p>
      </div>
      <div class="modal-foot">
        <button type="button" class="sort-btn" @click="close">Cancel</button>
        <button type="button" class="sort-btn sort-btn-active" :disabled="generating" @click="submit">
          {{ generating ? "Composing…" : "Open GitHub issue" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 22, 40, 0.55);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal {
  background: var(--color-paper-soft);
  border-radius: var(--radius-card);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--color-rule);
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-rule-soft);
}
.modal-head h2 {
  margin: 0;
  font-size: 1.15rem;
  border: none;
  padding: 0;
}
.modal-close {
  appearance: none;
  background: transparent;
  border: 0;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-ink-muted);
  padding: 0.25em 0.5em;
}
.modal-body { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.9rem; }
.modal-term { margin: 0 0 0.4em; }
.modal-issue-preview {
  font-size: 0.88em;
  background: var(--color-paper-tint);
  padding: 0.5em 0.75em;
  border-radius: 4px;
  margin: 0;
}
.modal-success {
  font-size: 0.88em;
  color: var(--color-green);
  margin: 0;
}
.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
  padding: 0.8rem 1.25rem;
  border-top: 1px solid var(--color-rule-soft);
}
.proposal-target {
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  padding: 0.6em 0.9em;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}
.proposal-target legend {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--color-ink-muted);
  padding: 0 0.4em;
}
.proposal-target-option {
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
  padding: 0.55em 0.7em;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.proposal-target-option:hover {
  background: var(--color-paper-tint);
}
.proposal-target-selected {
  background: var(--color-accent-tint);
  border-color: var(--color-accent-soft);
}
.proposal-target-option input[type="radio"] {
  margin-top: 0.35em;
}
.proposal-target-text {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  flex: 1;
}
.proposal-target-concept {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-ink);
  letter-spacing: -0.005em;
  font-variation-settings: "opsz" 24, "SOFT" var(--display-soft, 30), "WONK" var(--display-wonk, 0);
}
.proposal-target-arrow {
  display: none; /* the layout flows naturally without an arrow glyph */
}
.proposal-target-vocab {
  font-size: 0.88rem;
  color: var(--color-accent);
  font-weight: 500;
}
.proposal-target-examples {
  font-size: 0.8rem;
  color: var(--color-ink-muted);
  font-style: italic;
}
.proposal-field {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  font-size: 0.88rem;
}
.proposal-field span {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: var(--color-ink-muted);
}
.proposal-field textarea,
.proposal-field input {
  padding: 0.5em 0.7em;
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  font: inherit;
  font-size: 0.92rem;
  background: var(--color-paper-soft);
  color: var(--color-ink);
}
.proposal-field textarea:focus,
.proposal-field input:focus {
  outline: none;
  border-color: var(--color-ink);
}
</style>
