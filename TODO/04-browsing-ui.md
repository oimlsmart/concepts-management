# 04 — Build browsing UI (per-term / per-TC / per-publication)

## Required views

### Per-term view
- Header: preferred term + official definition (if any) + VIM/VIML link
- AI consistency badge: "All consistent" / "Mixed (X ok, Y partial, Z ko)"
- Publications table (sorted year DESC): publication, TC/SC, year, definition used, consistency badge
- For each row: link to the source PDF + link to that G 18 entry
- Filter: only show instances where definitions diverge from official

### Per-TC/SC view
- Header: TC 1 / Vocabularies (or whichever TC)
- Stats: # of terms in scope, # defined in VIM/VIML, # with consistency issues
- Term list (alphabetical) with quick consistency badges
- Click a term → per-term view

### Per-publication view
- Header: e.g. "OIML R 60:2021 Metrological regulation for load cells"
- TC/SC: TC 9/SC 1
- All terms used in this publication, with cross-links to per-term views
- Definition used for each term (verbatim from publication)

### Divergence leaderboard
- Top 20 terms with the most distinct definitions across publications
- For each: how many distinct definitions, which publication is "authoritative" (most-recent / TC-voted / most-cited)

## Tech stack

Options to consider:
- `@glossarist/concept-browser` with custom config (existing skillset, but the model is vocabulary-centric)
- Static site with Vue 3 / React (faster iteration, more flexibility)
- Pure HTML + JSON (simplest, but no interactivity)

Recommendation: start with `@glossarist/concept-browser` if the data fits, fall back to custom Vue app if not. Render `data/` as a concept dataset and customize the templates for the registry view.

## Acceptance

- A user can: pick a term, see all its publication instances; pick a TC, see all terms it has produced; pick a publication, see all terms it uses; pick a "most divergent" term, see the divergence breakdown.
- Cross-links to VIM/VIML concept pages on `oimlsmart.github.io/vocab` work.
- Page loads in <2s for any term (no client-side fetches for full data; pre-built static).
