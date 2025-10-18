import enStrings from './locales/en/common.json'
import arStrings from './locales/ar/common.json'

export type UILocale = 'en' | 'ar'

export const supportedUILocales: UILocale[] = ['en', 'ar']
export const defaultUILocale: UILocale = 'en'

export function getLocaleFromPath(pathname: string, basePath = ''): UILocale {
  const afterBase = basePath ? pathname.replace(new RegExp(`^${basePath}`), '') : pathname
  const m = afterBase.match(/^\/(en|ar)(\/|$)/)
  return (m ? (m[1] as UILocale) : defaultUILocale)
}

export function getStrings(locale: UILocale) {
  return locale === 'ar' ? arStrings : enStrings
}

export function applyDirection(locale: UILocale) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.lang = locale
  }
}

export default {
  locales: supportedUILocales,
  defaultLocale: defaultUILocale,
  getLocaleFromPath,
  getStrings,
  applyDirection,
}
