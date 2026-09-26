/**
 * The concepts-management nav model — the ordered items the house
 * shell's header, the mobile overlay, and the footer's Explore column
 * render (one model, injected through the layout's `nav` prop,
 * TODO.ia/03). The shell went machinery-only at 0.2.0: the model moved
 * into this repository, shaped to the package's NavModel contract
 * (@oimlsmart/site-shell/config). The file is data-only: the
 * active-path predicates ship with the package's config contract,
 * never from here.
 *
 * The model is the site's own information architecture, never the www
 * reference preset. The registry's three primary sections stand as
 * standalone links, and the two analysis groups the old header carried
 * as dropdowns stay dropdowns:
 *
 *   1. Concepts     — the term-usage registry itself.
 *   2. Publications — the OIML publications the registry covers.
 *   3. TC / SC      — the concepts grouped by committee.
 *   4. Analysis     — the cross-publication consistency findings.
 *   5. G 18         — the per-edition views of the G 18 corpus.
 *
 * The product CTA is the How to use page: the registry is a read-only
 * reference, and the one thing a first-time visitor needs is the
 * reading guide. Cross-site navigation is deliberately absent from the
 * top nav — it lives in the footer (the Programme column and the hosts
 * registry).
 *
 * Hrefs stay root-relative against the site's base; `origin`
 * absolutizes them at render, so the chrome's links resolve from any
 * host (ADR-0003).
 */
import type { NavDropdownConfig, NavModel } from '@oimlsmart/site-shell/config'
import { SITE } from './site-meta.ts'

// The relative import above carries an explicit .ts extension on
// purpose (the only such import in src/data): the nav completeness
// gate (scripts/check-nav.mjs, via the shell's check-nav) loads this
// file under plain node's type stripping, which resolves relative
// specifiers literally — the extensionless house style would 404 it.
// The same constraint keeps this module data-only: the active-path
// predicates stay in the package (@oimlsmart/site-shell/config), and
// importing them here would drag the package's TypeScript source into
// a plain-node load, which node refuses to strip under node_modules.

/** The cross-publication consistency findings. */
export const ANALYSIS_DROPDOWN: NavDropdownConfig = {
  id: 'analysis',
  label: 'Analysis',
  variant: 'default',
  links: [
    { label: 'Suggested actions', href: `${SITE.base}/analysis/actions/`, desc: 'The harmonization work the registry proposes' },
    { label: 'Vocabulary gaps', href: `${SITE.base}/analysis/gaps/`, desc: 'Terms the publications use but never define' },
    { label: 'Divergence', href: `${SITE.base}/analysis/divergence/`, desc: 'Where definitions of one term diverge' },
  ],
}

/** The per-edition views of the G 18 corpus. */
export const G18_DROPDOWN: NavDropdownConfig = {
  id: 'g18',
  label: 'G 18',
  variant: 'default',
  links: [
    { label: 'Coverage gaps', href: `${SITE.base}/g18/gaps/`, desc: 'What the published editions do not cover' },
    { label: 'Designation collisions', href: `${SITE.base}/g18/designations/`, desc: 'One designation, several concepts' },
    { label: 'G 18:202X readiness', href: `${SITE.base}/g18/202x/`, desc: 'The draft edition against the publication corpus' },
    { label: 'G 18:current', href: `${SITE.base}/g18/current/`, desc: 'The published edition, browsable' },
    { label: 'G 18 concepts', href: `${SITE.base}/g18/concepts/`, desc: 'Every concept the editions carry' },
    { label: 'ID conflicts', href: `${SITE.base}/g18/conflicts/`, desc: 'Identifier collisions across editions' },
    { label: 'Editions', href: `${SITE.base}/g18/editions/`, desc: 'The edition history of G 18' },
  ],
}

/** The minisite strip's sections — the site-local navigation under the
 *  federation header (hrefs resolve against the MinisiteNav base). */
export const MINISITE_SECTIONS = [
  { label: 'Home', href: '' },
  { label: 'Concepts', href: 'concepts/' },
  { label: 'Publications', href: 'publications/' },
  { label: 'TC / SC', href: 'tc/' },
]

export const NAV_MODEL: NavModel = {
  // Front-door absolute at render (ADR-0003): the chrome's links
  // resolve from any origin.
  origin: SITE.url,
  items: [
    { type: 'link', label: 'Concepts', href: `${SITE.base}/concepts/`, matchPrefix: `${SITE.base}/concepts/` },
    { type: 'link', label: 'Publications', href: `${SITE.base}/publications/`, matchPrefix: `${SITE.base}/publications/` },
    { type: 'link', label: 'TC / SC', href: `${SITE.base}/tc/`, matchPrefix: `${SITE.base}/tc/` },
    { type: 'dropdown', config: ANALYSIS_DROPDOWN },
    { type: 'dropdown', config: G18_DROPDOWN },
  ],
  productCta: { label: 'How to use', href: `${SITE.base}/how-to-use/` },
}
