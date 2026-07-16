/**
 * Normalizes a route path and locale to match Nuxt Content's database paths.
 * Nuxt Content registers directory-based paths in lowercase (e.g. /en-ca/about).
 * This helper normalizes any path and locale casing (e.g. en-CA, en-Ca, en-ca)
 * to guarantee case-insensitive matches.
 */
export function toContentPath(path: string, locale: string): string {
  const normLocale = locale.toLowerCase()
  const normPath = path.toLowerCase()
  
  if (normPath.startsWith(`/${normLocale}`)) {
    return normPath
  }
  
  const normalized = normPath === '/' ? '' : normPath
  return `/${normLocale}${normalized}`
}
