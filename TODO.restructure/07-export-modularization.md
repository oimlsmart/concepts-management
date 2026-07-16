# 07 — Export script modularization

## Context
`scripts/export_for_vite.rb` is a 999-line god object. Split into focused modules.

## Target structure
```
lib/g18/export/
  renderer.rb          # Plurimath/MathML rendering (render_stem, render_stem_deep)
  glossarist_bridge.rb # Node.js bridge (load_concept_index_via_glossarist, cached_concept_lookup)
  publication_enricher.rb # Bibliography loading, relaton TC/SC, lifecycle, withdrawn detection
  matcher.rb           # check_latest_edition, check_vocab_presence, classify_alignment
  term_processor.rb    # Main loop: per-term data fixups, vocab enrichment, action compilation
  json_writer.rb       # All JSON output files (terms.json, terms-slim, dashboard, etc.)
  pipeline.rb          # Orchestrator that ties modules together
```

## Migration path
1. Extract `render_stem`/`render_stem_deep` → `G18::Export::Renderer`
2. Extract glossarist bridge functions → `G18::Export::GlossaristBridge`
3. Extract publication loading + relaton → `G18::Export::PublicationEnricher`
4. Extract matching functions → `G18::Export::Matcher`
5. Extract JSON output → `G18::Export::JsonWriter`
6. `export_for_vite.rb` becomes a thin entry point that calls `G18::Export::Pipeline.run`

## Shared utilities to extract
- Pub dedup by (pub_id, clause) → `G18::Export::Deduplicator`
- STRIP_FROM_PUB constant + application → `G18::Export::PublicationStripper`
- sourced_from extraction → single method in `G18::Export::SourcedFromExtractor`
