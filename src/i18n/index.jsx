import { useEffect, useMemo, useState } from 'react'
import { appMessages, DEFAULT_LOCALE, localeOptions, LOCALE_STORAGE_KEY } from './config'
import { I18nContext } from './context'

function readStoredLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return localeOptions.some((item) => item.code === storedLocale) ? storedLocale : DEFAULT_LOCALE
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => readStoredLocale())

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(() => ({
    locale,
    setLocale,
    localeOptions,
    messages: appMessages[locale] ?? appMessages.en,
  }), [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
