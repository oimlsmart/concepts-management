// VIM/VIML edition classification — single source of truth in TypeScript.
// Mirrors G18::Vocabulary in the Ruby side. All components use this
// composable instead of inlining edition logic.
import type { VocabName, VocabRole, AuthorityRef } from "../types/model";

const VIM_EDITIONS: Record<string, { year: number; role: VocabRole }> = {
  "urn:oiml:pub:v:2:1993": { year: 1993, role: "legacy" },
  "urn:oiml:pub:v:2:2007": { year: 2007, role: "prior" },
  "urn:oiml:pub:v:2:2010": { year: 2010, role: "prior" },
  "urn:oiml:pub:v:2:2012": { year: 2012, role: "current" },
};

const VIML_EDITIONS: Record<string, { year: number; role: VocabRole }> = {
  "urn:oiml:pub:v:1:1968": { year: 1968, role: "legacy" },
  "urn:oiml:pub:v:1:2000": { year: 2000, role: "prior" },
  "urn:oiml:pub:v:1:2013": { year: 2013, role: "prior" },
  "urn:oiml:pub:v:1:2022": { year: 2022, role: "current" },
};

const ALL_EDITIONS = { ...VIM_EDITIONS, ...VIML_EDITIONS };

export function useVocabularyEdition() {
  function vocab(urn: string): VocabName | null {
    if (VIM_EDITIONS[urn]) return "vim";
    if (VIML_EDITIONS[urn]) return "viml";
    return null;
  }

  function year(urn: string): number | null {
    return ALL_EDITIONS[urn]?.year ?? null;
  }

  function role(urn: string): VocabRole | null {
    return ALL_EDITIONS[urn]?.role ?? null;
  }

  function label(urn: string): string {
    const v = vocab(urn);
    const y = year(urn);
    return v && y ? `${v.toUpperCase()} ${y}` : urn || "—";
  }

  function confidenceClass(urn: string): string {
    const v = vocab(urn);
    const r = role(urn);
    if (!v || !r) return "";
    return `viml-ref ${v}-${r}`;
  }

  function isCurrent(urn: string): boolean {
    return role(urn) === "current";
  }

  function isSuperseded(urn: string): boolean {
    const r = role(urn);
    return r === "prior" || r === "legacy";
  }

  function latestLabel(urn: string): string {
    return vocab(urn) === "vim" ? "VIM 2012" : "VIML 2022";
  }

  function vocabUrl(urn: string, id: string): string | null {
    const v = vocab(urn);
    const y = year(urn);
    if (!v || !y || !id) return null;
    return `https://oimlsmart.github.io/vocab/${v}-${y}/concept/${id}`;
  }

  return {
    vocab, year, role, label,
    confidenceClass, isCurrent, isSuperseded,
    latestLabel, vocabUrl,
  };
}
