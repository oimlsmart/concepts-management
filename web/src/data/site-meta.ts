/**
 * The concepts-management site constants — the identity and origin
 * values the injected configs (brand, nav, footer) compose from
 * (TODO.ia/03: the shell went machinery-only at 0.2.0, so the site
 * carries its own content). Data-only under plain node: the nav
 * completeness gate (scripts/check-nav.mjs, via the shell's check-nav)
 * loads the nav model through this module, so nothing here may import
 * the package's TypeScript source.
 */
export const SITE = {
  url: 'https://www.oimlsmart.org',
  base: '/concepts-management',
  title: 'OIML Concepts Management',
  description:
    'OIML Concepts Management — harmonise, validate, and align terminology across OIML publications.',
}
