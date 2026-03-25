import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ProgressBar } from '../ui'
import {
  getDefaultOpenSectionKeys,
  orderSectionsForContext,
} from './simulationContent'

function SectionCard({ section, isOpen, onToggle, recommendationLabel }) {
  const Icon = section.icon

  return (
    <div className={`rounded-[1.15rem] border transition-colors ${
      isOpen
        ? 'border-white/[0.08] bg-white/[0.028]'
        : 'border-white/[0.04] bg-white/[0.015]'
    }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.012]"
      >
        <span className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.035] ${section.tone}`}>
          <Icon className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="truncate text-[13px] font-semibold text-white">{section.title}</div>
              {recommendationLabel ? (
                <span className="rounded-full border border-primary/14 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-primary">
                  {recommendationLabel}
                </span>
              ) : null}
              {section.summary ? (
                <span className="rounded-full border border-white/6 bg-white/[0.025] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-gray-400">
                  {section.summary}
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-[11px] text-gray-500">{section.description}</div>
          </div>
        </div>

        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen ? (
        <div className="space-y-4 border-t border-white/[0.05] px-4 pb-4 pt-3">
          <div className="space-y-2">
            {section.rows?.map((row) => (
              <div
                key={row.label}
                className="grid gap-1.5 border-b border-white/[0.045] px-0 py-1.75 last:border-b-0"
              >
                <div className="text-[11px] tracking-[0.12em] text-gray-500">{row.label}</div>
                <div className="text-[13px] text-gray-100">{row.value}</div>
              </div>
            ))}
          </div>

          {section.sliders ? (
            <div className="space-y-2.5">
              {section.sliders.map((slider) => (
                <div key={slider.label}>
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-gray-500">
                    <span>{slider.label}</span>
                    <span>{slider.value}%</span>
                  </div>
                  <ProgressBar value={slider.value} color={slider.color ?? 'primary'} size="sm" />
                </div>
              ))}
              {section.footer ? (
                <div className="text-right text-xs text-gray-500">{section.footer}</div>
              ) : null}
            </div>
          ) : null}

          {section.stats ? (
            <div className="flex flex-wrap gap-2">
              {section.stats.map((stat) => (
                <div key={stat.label} className="rounded-full border border-white/6 bg-white/[0.025] px-3 py-1.5 text-[11px]">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="ml-1.5 text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function SimulationParameterSidebar({
  copy,
  currentSelection,
  sections,
  selectedPart,
  selectedRobot,
  selectedTool,
  selectedToolLabel,
  selectedViewLabel,
  toolProfile,
}) {
  const [openKeys, setOpenKeys] = useState(['compute'])
  const sectionKeySignature = useMemo(
    () => sections.map((section) => section.key).join('|'),
    [sections],
  )
  const availableSectionKeys = useMemo(
    () => (sectionKeySignature ? sectionKeySignature.split('|') : []),
    [sectionKeySignature],
  )
  const orderedSections = useMemo(
    () => orderSectionsForContext(sections, selectedTool, selectedPart),
    [sections, selectedPart, selectedTool],
  )
  const recommendedKeys = useMemo(
    () => getDefaultOpenSectionKeys(
      availableSectionKeys.map((key) => ({ key })),
      selectedTool,
      selectedPart,
    ),
    [availableSectionKeys, selectedPart, selectedTool],
  )

  useEffect(() => {
    setOpenKeys(recommendedKeys)
  }, [recommendedKeys])

  const toggleSection = (key) => {
    setOpenKeys((current) => (
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    ))
  }

  return (
    <div
      id="simulation-sidebar"
      className="order-3 w-full min-w-0 shrink-0 xl:order-none xl:w-[288px] xl:min-w-[288px] 2xl:w-[300px] 2xl:min-w-[300px]"
    >
      <div className="overflow-hidden rounded-[1.8rem] border border-white/6 bg-[rgba(11,16,23,0.84)] shadow-[0_12px_28px_rgba(2,6,23,0.12)] xl:sticky xl:top-[74px] xl:flex xl:max-h-[calc(100vh-8.75rem)] xl:flex-col">
        <div className="border-b border-white/[0.045] px-3.5 py-3">
          <div className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{copy.eyebrow}</div>
          <h3 className="mt-1.5 text-[15px] font-semibold text-white">{copy.title}</h3>
          <p className="mt-1.5 text-[12px] leading-5 text-gray-500">
            {copy.description}
          </p>

          <div className="mt-2.5 rounded-[1.25rem] border border-white/[0.05] bg-white/[0.02] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{copy.modeLabel}</div>
                <div className="mt-1 text-[14px] font-semibold text-white">{selectedToolLabel}</div>
                <div className="mt-1 text-[11px] text-primary">{toolProfile.emphasis}</div>
              </div>
              <span className="rounded-full border border-white/6 bg-white/[0.025] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-gray-400">
                {selectedViewLabel}
              </span>
            </div>

            <p className="mt-2 text-[12px] leading-5 text-gray-500">
              {toolProfile.description}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-[1rem] border border-white/[0.045] bg-[rgba(255,255,255,0.02)] px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500">{copy.robotLabel}</div>
                <div className="mt-1 truncate text-[12px] font-medium text-white">{selectedRobot.id}</div>
              </div>
              <div className="rounded-[1rem] border border-white/[0.045] bg-[rgba(255,255,255,0.02)] px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500">{copy.focusLabel}</div>
                <div className="mt-1 truncate text-[12px] font-medium text-white">{currentSelection?.label ?? copy.defaultFocus}</div>
              </div>
            </div>

            <div className="mt-3 rounded-[1rem] border border-white/[0.045] bg-[rgba(255,255,255,0.015)] px-3 py-2.5 text-[11px] leading-5 text-gray-500">
              {toolProfile.focusHint}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 overflow-y-auto px-2.5 py-2.5 xl:flex-1">
          {orderedSections.map((section, index) => (
            <SectionCard
              key={section.key}
              isOpen={openKeys.includes(section.key)}
              onToggle={() => toggleSection(section.key)}
              recommendationLabel={recommendedKeys.includes(section.key) && index < 2 ? (index === 0 ? copy.primaryRecommendation : copy.linkedRecommendation) : null}
              section={section}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
