# 05 — AI consistency check (official vs publication definitions)

## Goal

For each (term, publication) instance, classify how the publication's
definition compares to the official definition (or to the "target
definition" for terms not in VIM/VIML):

- `ok` — semantically equivalent
- `partial` — mostly equivalent but missing nuance
- `ko` — substantively different or contradictory
- `pending` — not yet assessed

## Approach

1. **Cache key**: `(official_definition_hash, publication_definition_hash) → result`
2. **Prompt template** (LLM):
   ```
   Official definition: <text>
   Publication's definition: <text>
   Classify as: ok | partial | ko
   Briefly explain any divergence (1 sentence).
   ```
3. **LLM choice**: Claude Haiku (cheap, fast, good enough for short text comparison)
4. **Cache storage**: a JSON file `cache/consistency.jsonl`, one line per comparison
5. **Re-run trigger**: when official definition changes, mark dependent entries stale and re-assess
6. **Human review**: surface borderline cases (`partial`) for editor confirmation

## Failure modes

- LLM may over-rate `ok` (lenient) or `ko` (strict) — calibrate against a small gold set
- Definitions in different languages (FR vs EN) need cross-language handling
- Definitions with significantly different framing may confuse the LLM

## Cost estimate

- 2132 instances to assess, most cached after first run
- Re-run only needed when official defs change
- Initial run: ~$5 in API costs at Haiku pricing

## Acceptance

- Every G 18 instance has a `consistency` value (none left as `pending` after initial run)
- Borderline (`partial`) cases are surfaced to editors for review
- Cache invalidation works when official definitions change
- Re-running is idempotent
