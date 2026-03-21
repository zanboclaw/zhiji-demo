import { tools } from './simulationContent'

export function SimulationToolDock({ selectedTool, setSelectedTool }) {
  return (
    <div
      id="simulation-tool-dock"
      className="order-1 flex gap-2 overflow-x-auto rounded-[1.35rem] border border-white/[0.05] bg-[rgba(10,14,20,0.66)] p-1.5 lg:sticky lg:top-[74px] lg:w-[64px] lg:shrink-0 lg:flex-col lg:self-start lg:overflow-visible lg:p-1 xl:order-none xl:justify-start"
    >
      {tools.map((tool) => {
        const Icon = tool.icon
        const isActive = selectedTool === tool.id

        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => setSelectedTool(tool.id)}
            title={tool.label}
            aria-label={tool.label}
            className={`group relative flex min-w-fit items-center gap-2 rounded-[0.9rem] px-3 py-2.5 text-xs transition-all lg:min-h-[56px] lg:w-full lg:flex-col lg:justify-center lg:gap-1 lg:px-1.5 lg:py-2 ${
              isActive
                ? 'border border-white/[0.06] bg-white/[0.045] text-white'
                : 'border border-transparent bg-transparent text-gray-500 hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-white'
            }`}
          >
            <span
              className={`absolute bottom-2 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full transition-colors lg:bottom-auto lg:left-1.5 lg:top-1/2 lg:h-1.5 lg:w-1.5 lg:-translate-x-0 lg:-translate-y-1/2 ${
                isActive ? 'bg-primary/80' : 'bg-transparent group-hover:bg-white/15'
              }`}
            />
            <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-[11px] lg:hidden">{tool.label}</span>
          </button>
        )
      })}
    </div>
  )
}
