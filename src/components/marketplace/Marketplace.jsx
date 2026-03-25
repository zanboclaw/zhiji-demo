import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMarketplaceStore } from '../../store'
import { useI18n } from '../../i18n/context'
import { filterAndSortSkills } from './marketplaceHelpers'
import { MarketplaceHeader } from './MarketplaceHeader'
import { MarketplaceFilters } from './MarketplaceFilters'
import { MarketplaceCard } from './MarketplaceCard'
import { MarketplaceDetailModal } from './MarketplaceDetailModal'
import { MarketplaceToast } from './MarketplaceToast'
import { getMarketplaceCopy } from './marketplaceI18n'

export function Marketplace() {
  const { locale } = useI18n()
  const {
    selectedCategory,
    selectedSort,
    searchQuery,
    installedSkills,
    setSelectedCategory,
    setSelectedSort,
    setSearchQuery,
    installSkill,
  } = useMarketplaceStore()

  const [selectedSkill, setSelectedSkill] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)
  const [toast, setToast] = useState('')
  const content = useMemo(() => getMarketplaceCopy(locale), [locale])
  const { filters, header, list, card, modal, skillsData } = content
  const sortOptions = filters.sortOptions
  const categories = filters.categories
  const installedCount = installedSkills.length

  const filteredSkills = useMemo(
    () => filterAndSortSkills({ skillsData, selectedCategory, searchQuery, selectedSort }),
    [searchQuery, selectedCategory, selectedSort, skillsData],
  )
  const currentSortLabel = sortOptions.find((option) => option.id === selectedSort)?.label ?? sortOptions[0]?.label

  const handleDownload = (skillId) => {
    setDownloadingId(skillId)
    window.setTimeout(() => {
      installSkill(skillId)
      setDownloadingId(null)
      setToast(list.installToast)
      window.setTimeout(() => setToast(''), 2400)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(5,8,13,0.97)_0%,rgba(5,7,11,0.98)_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <MarketplaceHeader copy={header} installedCount={installedCount} />

        <MarketplaceFilters
          categories={categories}
          copy={filters}
          skillsData={skillsData}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          searchQuery={searchQuery}
          setSelectedCategory={setSelectedCategory}
          setSelectedSort={setSelectedSort}
          setSearchQuery={setSearchQuery}
          sortOptions={sortOptions}
        >
          <div className="mb-5 flex flex-col gap-2 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{list.eyebrow}</div>
              <div className="mt-2 text-lg font-medium text-white">{list.title}</div>
              <div className="mt-1 text-sm text-gray-400">{list.countLabel(filteredSkills.length, currentSortLabel)}</div>
            </div>
            <span className="text-sm text-gray-500">{list.syncHint}</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSkills.map((skill, index) => {
              const isInstalled = installedSkills.includes(skill.id)
              const isDownloading = downloadingId === skill.id

              return (
                <MarketplaceCard
                  copy={card}
                  key={skill.id}
                  skill={skill}
                  index={index}
                  isInstalled={isInstalled}
                  isDownloading={isDownloading}
                  onShowDetails={setSelectedSkill}
                  onDownload={handleDownload}
                />
              )
            })}
          </div>
        </MarketplaceFilters>

        <AnimatePresence>
          {selectedSkill && (
            <MarketplaceDetailModal
              copy={modal}
              selectedSkill={selectedSkill}
              onClose={() => setSelectedSkill(null)}
              onDownload={handleDownload}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>{toast && <MarketplaceToast toast={toast} />}</AnimatePresence>
      </div>
    </div>
  )
}
