import { Search, SlidersHorizontal, Layers3 } from 'lucide-react'
import { getCategorySkillCount } from './marketplaceHelpers'

export function MarketplaceFilters({
  categories,
  copy,
  skillsData,
  selectedCategory,
  selectedSort,
  searchQuery,
  setSelectedCategory,
  setSelectedSort,
  setSearchQuery,
  sortOptions,
  children,
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[224px_minmax(0,1fr)] lg:items-start xl:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="rounded-[1.6rem] border border-white/6 bg-[linear-gradient(180deg,rgba(15,20,28,0.86),rgba(12,17,24,0.72))] p-4 shadow-[0_14px_34px_rgba(2,6,23,0.18)] lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary/80" />
          {copy.title}
        </div>

        <div className="space-y-1.5">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm transition-all ${
                selectedCategory === category.id
                  ? 'border border-primary/[0.22] bg-primary/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
                  : 'border border-transparent bg-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <span>{category.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  selectedCategory === category.id ? 'bg-primary/10 text-primary/[0.9]' : 'text-gray-500'
                }`}
              >
                {getCategorySkillCount(skillsData, category.id)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 border-t border-white/8 pt-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            <Layers3 className="h-3.5 w-3.5 text-primary/80" />
            {copy.platformTitle}
          </div>
          <div className="mt-3 text-sm leading-6 text-gray-400">
            {copy.platformDescription}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,23,31,0.92),rgba(13,18,25,0.9))] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.2)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder={copy.searchPlaceholder}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-[3.25rem] w-full rounded-[1.1rem] border border-white/10 bg-white/[0.035] pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-primary/[0.28] focus:bg-white/[0.05] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedSort(option.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selectedSort === option.id
                      ? 'border-primary/20 bg-primary/[0.12] text-white'
                      : 'border-white/8 bg-white/[0.03] text-gray-400 hover:border-white/12 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
            {copy.chips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
