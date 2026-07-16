# 08 — Test coverage plan

## Current state
- Ruby: 180 lines across 2 files (only Actions::Compiler + Action tested)
- Frontend: 1484 lines across 14 files (composables, utils, components, data contracts)

## Ruby specs to add

### Migration specs
```
spec/migration/
  loaders_spec.rb      # YAML parsing, source extraction, designation extraction
  builders_spec.rb     # build_term_record, build_publication_entry, pick_official
  runner_spec.rb       # End-to-end migration with test fixtures
  conflicts_spec.rb    # ID conflict detection
  normalize_spec.rb    # Designation normalization, slugify
```

### Matching specs
```
spec/fuzzy_match_spec.rb   # Jaccard matching, threshold, edge cases
spec/export/matcher_spec.rb # check_latest_edition, check_vocab_presence, classify_alignment
```

### Export specs
```
spec/export/publication_enricher_spec.rb # Lifecycle computation
spec/export/deduplicator_spec.rb         # Pub dedup by (pub_id, clause)
```

## Frontend specs to add

### Composable specs
```
src/composables/useJsonFetch.test.ts  # Fetch-on-demand with loading/error states
```

### Component specs (integration)
```
src/islands/TermsListPage.test.ts  # Filtering, sorting, alignment display
```

## Test fixtures
Create `spec/fixtures/` with:
- Sample concept YAML files (1 VIM, 1 VIML, 1 OIML-original)
- Sample terms.json (small subset)
- Sample publications.json
