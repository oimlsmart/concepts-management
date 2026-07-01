# 02 — Convert `datasets/g18/` to per-term model with publication instances

## Problem

`oimlsmart/vocab` `datasets/g18/` has 2132 concept files. Each represents
**one (term, publication) combination**: a term-in-a-publication. There are
1207 unique terms and 287 terms appear in multiple publications (e.g.
"influence quantity" 26 times across 26 different OIML publications).

Each entry currently has:
- `data.identifier` (5-digit G 18 number)
- `data.sources` (one publication, with `origin.ref.source` like `OIML B003:2003`)
- `data.terms` (preferred designation, EN)
- `related: - type: see` edges to VIM/VIML when the term is defined there (101 edges)
- `data.domains` (one per source publication)

The current model maps to "per-instance" naturally, but the **browsing
experience** we want is "per-unique-term" with the instances listed
underneath.

## Target model

One file per **unique term** (1207 files). Each file has:

```yaml
---
data:
  identifier: '1031'              # lowest G 18 number for this term (or canonical id)
  term: influence factor
  kind: defined_in_viml            # | defined_in_vim | example_of_viml_concept | example_of_vim_concept | undefined
  official_concept:                # populated when kind=defined_in_*
    source: urn:oiml:pub:v:2:2022
    id: '5.18'
    url: https://oimlsmart.github.io/vocab/dataset/viml-2022/concept/5.18
  publications:                    # ordered by year DESC at render time
    - publication: OIML R 60:2021
      tc_sc: TC 9/SC 1
      year: 2021
      g18_entry: '1303'            # back-reference to original instance
      definition: |
        <the definition text exactly as written in R 60:2021>
      consistency: ok              # | ko | partial | pending (AI-assessed)
      consistency_reason: ""
    - publication: OIML D 11:2004
      ...
  skos_narrower_of:                # populated when kind=example_of_*
    - urn:oiml:pub:v:1:2022/0.11
status: current
id: <stable-uuid-for-this-term>
schema_version: '3'
related:
- type: see
  ref:
    source: urn:oiml:pub:v:2:2022
    id: '5.18'
```

## Steps

1. Write a migration script (`scripts/migrate_from_vocab.rb` or `.py`) that:
   - Reads every `datasets/g18/concepts/*.yaml` from the vocab repo
   - Groups by lowercased preferred term
   - Emits one file per unique term into this repo's `data/` directory
2. Preserve all 101 VIM/VIML cross-refs as `related: - type: see` on the parent term
3. Re-classify terms:
   - "kind: defined_in_viml/vim" when a `see` edge exists
   - "kind: example_of_*" for terms that have a `skos:narrower` relationship
   - "kind: undefined" otherwise
4. Add migration output to a `migration-report.md` for editor review

## Acceptance

- 1207 files in `data/` (one per unique term)
- Sum of `publications[]` entries across all files = 2132 (no instances lost)
- All 101 VIM/VIML cross-refs preserved (counted across new files)
- No data deleted; vocab repo's `datasets/g18/` unchanged
