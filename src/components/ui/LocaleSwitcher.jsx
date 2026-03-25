import { Languages } from 'lucide-react'
import { useI18n } from '../../i18n/context'

export function LocaleSwitcher({ className = '' }) {
  const { locale, setLocale, localeOptions, messages } = useI18n()

  return (
    <label className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 transition-colors ${className}`}>
      <Languages className="h-4 w-4 text-primary" />
      <span className="hidden text-xs text-gray-400 sm:inline">{messages.layout.languageLabel}</span>
      <select
        data-testid="locale-select"
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        className="min-w-[5.5rem] appearance-none bg-transparent text-sm text-white outline-none"
      >
        {localeOptions.map((item) => (
          <option key={item.code} value={item.code} className="bg-slate-950 text-white">
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}
