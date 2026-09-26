/**
 * The concepts-management brand config — the identity values the site
 * injects into the house shell's header, mobile overlay, and footer
 * (one brand object passed to the one layout mount, TODO.ia/03). The
 * shape is the package's BrandConfig (@oimlsmart/site-shell/config).
 * No signInHref: the registry serves no authenticated surface, so no
 * sign-in link renders anywhere. The logo pair is the site's own
 * oiml-logo assets under its public directory, addressed front-door
 * absolute so the mark renders from any origin.
 */
import type { BrandConfig } from '@oimlsmart/site-shell/config'
import { SITE } from './site-meta'

export const BRAND: BrandConfig = {
  brandName: SITE.title,
  logoLight: `${SITE.url}${SITE.base}/oiml-logo.svg`,
  logoDark: `${SITE.url}${SITE.base}/oiml-logo-dark.svg`,
  homeHref: `${SITE.url}${SITE.base}/`,
  themeColor: '#004996',
}
