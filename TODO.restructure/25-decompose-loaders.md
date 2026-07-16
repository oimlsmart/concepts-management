# 25 — Decompose G18::Migration::Loaders (536 lines)

## Context
`lib/g18/migration/loaders.rb` has 5 distinct concerns crammed into
one module:

1. Concept file loading (lines 27-82): YAML → ManagedConcept + raw
2. Field accessors (lines 92-160): identifier, designations, definition
3. Paragraph extraction (lines 162-200): definition/notes/examples
4. Source attribution (lines 200-280): adoption_info, source_summaries
5. Helpers (lines 280-536): preferred?, expression?, designation_*,
   slugify, normalize_pub_id, etc.

## Plan
Split into focused modules under `lib/g18/migration/`:

- `loaders.rb` (slim) — file/dir loading, raw extraction
- `loaders/field_accessors.rb` — identifier, designations, definition accessors
- `loaders/paragraphs.rb` — definition/notes/examples extraction
- `loaders/sources.rb` — adoption/source_summaries
- `loaders/designation_types.rb` — type/status/usage_info helpers
- `loaders/text.rb` — slugify, normalize_pub_id, parse_year

Each becomes a module that Loaders extends. Spec file per concern.

## Why
- Each concern testable in isolation
- Easier to find the function you need
- File lengths stay under 200 lines

## Risk
Lots of callers reference `Loaders.foo`. Renaming would break them.
Mitigation: keep `Loaders.foo` as a facade that delegates to the new
sub-modules.
