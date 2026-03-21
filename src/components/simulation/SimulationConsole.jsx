import { useEffect, useMemo, useState } from 'react'
import {
  Bot,
  History,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
} from 'lucide-react'
import { buildConsoleTemplates, modelOptions, toolModeProfiles } from './simulationContent'

function getStatusMeta(isThinking, isRecording) {
  if (isThinking) {
    return {
      label: '执行中',
      tone: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
      pulse: 'bg-amber-300',
    }
  }

  if (isRecording) {
    return {
      label: '录制中',
      tone: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
      pulse: 'bg-sky-300',
    }
  }

  return {
    label: '待命',
    tone: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
    pulse: 'bg-emerald-300',
  }
}

function getMessageTone(type) {
  if (type === 'ai') {
    return {
      label: 'AI',
      tone: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
      dot: 'bg-sky-300',
    }
  }

  if (type === 'success') {
    return {
      label: 'OK',
      tone: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
      dot: 'bg-emerald-300',
    }
  }

  if (type === 'info') {
    return {
      label: 'INFO',
      tone: 'border-white/10 bg-white/[0.03] text-slate-300',
      dot: 'bg-slate-400',
    }
  }

  if (type === 'system') {
    return {
      label: 'SYS',
      tone: 'border-violet-400/20 bg-violet-400/10 text-violet-200',
      dot: 'bg-violet-300',
    }
  }

  return {
    label: 'USER',
    tone: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
    dot: 'bg-amber-300',
  }
}

function PanelShell({ title, subtitle, icon: Icon, meta, className = '', children }) {
  return (
    <section className={`overflow-hidden rounded-[1.7rem] border border-white/[0.06] bg-[rgba(11,16,23,0.84)] shadow-[0_14px_34px_rgba(2,6,23,0.16)] ${className}`}>
      <div className="border-b border-white/[0.045] px-4 py-3 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{subtitle}</div>
              <h3 className="mt-1 text-[15px] font-semibold text-white">{title}</h3>
            </div>
          </div>
          {meta ? <div>{meta}</div> : null}
        </div>
      </div>
      <div className="px-4 py-3 sm:px-5">{children}</div>
    </section>
  )
}

export function SimulationStatusPanel({
  className = '',
  currentSelection,
  isRecording,
  isThinking,
  logRef,
  messages,
  postureMetrics,
  selectedRobot,
  selectedTool,
  selectedToolLabel,
  selectedViewLabel,
  setIsRecording,
}) {
  const statusMeta = getStatusMeta(isThinking, isRecording)
  const toolProfile = toolModeProfiles[selectedTool] ?? toolModeProfiles.select
  const contextItems = [
    { label: '机器人', value: selectedRobot.id },
    { label: '视图', value: selectedViewLabel },
    { label: '工具', value: selectedToolLabel },
    { label: '焦点', value: currentSelection?.label ?? '整机仿真' },
  ]

  return (
    <div className={`flex min-h-0 flex-col gap-3 ${className}`}>
      <PanelShell
        icon={Terminal}
        subtitle="Execution State"
        title="状态与任务上下文"
        meta={(
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${statusMeta.tone}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.pulse}`} />
              {statusMeta.label}
            </span>
            <button
              type="button"
              onClick={() => setIsRecording?.(!isRecording)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                isRecording
                  ? 'border-sky-400/20 bg-sky-400/10 text-sky-200'
                  : 'border-white/8 bg-white/[0.02] text-gray-300 hover:border-white/12 hover:bg-white/[0.04]'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              {isRecording ? '停止录制' : '录制指令'}
            </button>
          </div>
        )}
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {contextItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/[0.045] bg-white/[0.02] px-3 py-2.5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500">{item.label}</div>
              <div className="mt-1 truncate text-[12px] font-medium text-slate-100">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-[1.25rem] border border-white/[0.05] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500">当前模式</div>
              <div className="mt-1 text-sm font-semibold text-white">{selectedToolLabel}</div>
            </div>
            <span className="rounded-full border border-primary/14 bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
              {toolProfile.emphasis}
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-5 text-gray-500">{toolProfile.description}</p>
          <div className="mt-3 rounded-[1rem] border border-white/[0.045] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 text-[11px] leading-5 text-gray-500">
            {toolProfile.focusHint}
          </div>
        </div>
      </PanelShell>

      <PanelShell
        icon={Target}
        subtitle="Focus Snapshot"
        title="聚焦当前部件"
      >
        <div className="rounded-[1.25rem] border border-white/[0.05] bg-white/[0.02] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Current Focus</div>
              <div className="mt-1 text-sm font-semibold text-white">{currentSelection?.label ?? '整机姿态与行为路径'}</div>
              <div className="mt-1 text-[12px] text-primary">{currentSelection?.badge ?? '全局观察'}</div>
            </div>
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-gray-400">
              {selectedViewLabel}
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {postureMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500">{metric.label}</div>
                <div className={`mt-1 text-[13px] font-semibold ${metric.tone}`}>{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>

      <PanelShell
        icon={History}
        subtitle="Runtime Log"
        title="运行日志"
        className="min-h-0 flex-1"
        meta={<span className="text-[11px] text-gray-500">{messages.length} 条记录</span>}
      >
        <div
          ref={logRef}
          className="max-h-[320px] space-y-2 overflow-y-auto pr-1 xl:max-h-[420px]"
        >
          {messages.length ? (
            messages.map((message) => {
              const tone = getMessageTone(message.type)

              return (
                <div key={message.id} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${tone.tone}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                      {tone.label}
                    </span>
                    {message.model ? (
                      <span className="rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-gray-500">
                        {message.model}
                      </span>
                    ) : null}
                    <span className="text-[10px] text-gray-600">{message.time}</span>
                  </div>
                  <div className="mt-2 text-[13px] leading-6 text-slate-200">{message.content}</div>
                </div>
              )
            })
          ) : (
            <div className="flex min-h-[260px] items-center justify-center rounded-[1.35rem] border border-dashed border-white/8 bg-white/[0.015] px-5 text-center">
              <div>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-primary">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div className="mt-3 text-[13px] font-medium text-slate-100">等待任务指令</div>
                <p className="mt-1 text-[12px] leading-5 text-gray-500">
                  左侧会持续记录状态变化、模板载入和执行结果。
                </p>
              </div>
            </div>
          )}
        </div>
      </PanelShell>
    </div>
  )
}

export function SimulationTaskComposer({
  currentSelection,
  inputValue,
  selectedModel,
  selectedPart,
  selectedRobot,
  selectedTool,
  selectedToolLabel,
  selectedViewLabel,
  setInputValue,
  setSelectedModel,
  onQuickAction,
  onSendMessage,
  setSelectedPart,
}) {
  const [activeTemplateId, setActiveTemplateId] = useState(null)

  const templates = useMemo(
    () => buildConsoleTemplates({
      selectedTool,
      selectedPart,
      currentSelection,
      robotId: selectedRobot.id,
    }),
    [currentSelection, selectedPart, selectedRobot.id, selectedTool],
  )
  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId) ?? templates[0] ?? null,
    [activeTemplateId, templates],
  )
  const selectedModelMeta = useMemo(
    () => modelOptions.find((option) => option.id === selectedModel) ?? {
      id: selectedModel ?? 'ChatGPT',
      label: selectedModel ?? 'ChatGPT',
      provider: 'Custom',
    },
    [selectedModel],
  )

  useEffect(() => {
    if (!templates.some((template) => template.id === activeTemplateId)) {
      setActiveTemplateId(templates[0]?.id ?? null)
    }
  }, [activeTemplateId, templates])

  const handleTemplatePick = (template) => {
    setActiveTemplateId(template.id)
    setInputValue(template.prompt)

    if (template.targetPart) {
      setSelectedPart?.(template.targetPart)
    }

    onQuickAction?.(`已载入任务模板：${template.label}`)
  }

  const handleInsertContext = () => {
    const contextSnippet = `上下文：机器人 ${selectedRobot.id} | 工具 ${selectedToolLabel} | 视图 ${selectedViewLabel} | 焦点 ${currentSelection?.label ?? '整机仿真'}`
    const nextValue = inputValue?.trim() ? `${inputValue}\n${contextSnippet}` : contextSnippet

    setInputValue(nextValue)
    onQuickAction?.('已插入当前上下文到任务流')
  }

  const handleSubmit = () => {
    if (!inputValue?.trim()) return
    onSendMessage?.()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <PanelShell
      icon={Terminal}
      subtitle="Task Composer"
      title="任务与指令编排"
      meta={(
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
            模板 {templates.length} 条
          </span>
          <span className="rounded-full border border-primary/14 bg-primary/10 px-3 py-1.5 text-primary">
            Enter 发送
          </span>
        </div>
      )}
    >
      <div className="rounded-[1.35rem] border border-white/[0.045] bg-[rgba(10,14,20,0.75)] p-3">
        <div className="grid gap-3 lg:grid-cols-3">
          <label className="block">
            <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-gray-500">任务模板</div>
            <div className="relative">
              <select
                value={activeTemplate?.id ?? ''}
                onChange={(event) => {
                  const template = templates.find((item) => item.id === event.target.value)
                  if (template) handleTemplatePick(template)
                }}
                className="w-full appearance-none rounded-[1rem] border border-white/[0.08] bg-white/[0.03] px-3 py-3 pr-10 text-[13px] text-white outline-none transition-colors focus:border-primary/35"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id} className="bg-slate-950 text-white">
                    {template.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
            </div>
          </label>

          <label className="block">
            <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-gray-500">模型选择</div>
            <div className="relative">
              <select
                value={selectedModelMeta.id}
                onChange={(event) => setSelectedModel(event.target.value)}
                className="w-full appearance-none rounded-[1rem] border border-white/[0.08] bg-white/[0.03] px-3 py-3 pr-10 text-[13px] text-white outline-none transition-colors focus:border-primary/35"
              >
                {modelOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-slate-950 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
            </div>
          </label>

          <div className="rounded-[1rem] border border-white/[0.08] bg-white/[0.03] px-3 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">当前聚焦</div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-medium text-white">{currentSelection?.label ?? '整机仿真'}</div>
                <div className="mt-1 text-[11px] text-gray-500">
                  {activeTemplate?.description ?? '根据当前场景自动补齐任务提示'}
                </div>
              </div>
              <span className="rounded-full border border-primary/14 bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
                {selectedToolLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[1rem] border border-white/[0.05] bg-white/[0.02] px-3 py-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[12px] text-gray-400">指令编排</div>
              <div className="mt-1 text-[11px] text-gray-500">
                模板 · {activeTemplate?.label ?? '自定义输入'} | 模型 · {selectedModelMeta.label}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
                {selectedViewLabel}
              </span>
            </div>
          </div>

          <textarea
            value={inputValue ?? ''}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeTemplate?.prompt ?? '输入任务命令，例如：校准 姿态 --robot Spot-0729'}
            className="min-h-[240px] w-full resize-none bg-transparent text-[13px] leading-6 text-slate-100 outline-none placeholder:text-gray-600 xl:min-h-[280px]"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleInsertContext}
            className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-[12px] font-medium text-gray-300 transition-colors hover:border-white/12 hover:bg-white/[0.05]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            插入上下文
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary px-4 py-2 text-[12px] font-medium text-white shadow-[0_10px_20px_rgba(249,115,22,0.16)] transition-colors hover:bg-primary/90"
          >
            <Send className="h-3.5 w-3.5" />
            发送执行
          </button>
        </div>
      </div>
    </PanelShell>
  )
}
