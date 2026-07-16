import { describe, it, expect } from "vitest";
import {
  ACTION_TYPES,
  ACTION_META,
  ACTION_TYPE_ORDER,
  actionTypeRank,
  sortByActionType,
} from "@/composables/action-utils";

describe("ACTION_TYPE_ORDER", () => {
  it("has no duplicates", () => {
    expect(new Set(ACTION_TYPE_ORDER).size).toBe(ACTION_TYPE_ORDER.length);
  });

  it("places upgrade actions first (highest-priority fixes)", () => {
    expect(ACTION_TYPE_ORDER.indexOf("upgrade_vim")).toBe(0);
    expect(ACTION_TYPE_ORDER.indexOf("upgrade_viml")).toBe(1);
  });

  it("places retire last (auxiliary, orthogonal to alignment)", () => {
    expect(ACTION_TYPE_ORDER.indexOf("retire")).toBe(ACTION_TYPE_ORDER.length - 1);
  });
});

describe("actionTypeRank", () => {
  it("returns the index in ACTION_TYPE_ORDER", () => {
    expect(actionTypeRank("upgrade_vim")).toBe(0);
    expect(actionTypeRank("removed")).toBe(2);
  });

  it("returns MAX_SAFE_INTEGER for unknown types", () => {
    expect(actionTypeRank("unknown")).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("returns MAX_SAFE_INTEGER for empty string", () => {
    expect(actionTypeRank("")).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe("sortByActionType", () => {
  it("sorts types by their rank in ACTION_TYPE_ORDER", () => {
    const input = ["unique", "harmonize", "upgrade_vim", "removed"];
    expect(sortByActionType(input)).toEqual(["upgrade_vim", "removed", "harmonize", "unique"]);
  });

  it("preserves relative order of unknown types", () => {
    const input = ["zzz", "aaa", "upgrade_vim"];
    const sorted = sortByActionType(input);
    expect(sorted[0]).toBe("upgrade_vim");
    // unknowns come after, sorted alphabetically? No — stable sort keeps input order
    expect(sorted.slice(1)).toEqual(["zzz", "aaa"]);
  });

  it("does not mutate the input", () => {
    const input = ["unique", "harmonize"];
    sortByActionType(input);
    expect(input).toEqual(["unique", "harmonize"]);
  });

  it("returns empty array for empty input", () => {
    expect(sortByActionType([])).toEqual([]);
  });
});

describe("ACTION_META + ACTION_TYPE_ORDER consistency", () => {
  it("every type in ACTION_TYPE_ORDER has metadata", () => {
    for (const t of ACTION_TYPE_ORDER) {
      expect(ACTION_META[t]).toBeDefined();
    }
  });
});
