import { AlertCircle, Battery, Radio, ShieldAlert, Wifi } from 'lucide-react'
import { Button, Card } from '../ui'
import { getEStopCardClass, getSignalLabel } from './dashboardUtils'

export function DashboardControlBar({
  isEStopActive,
  isRemoteControl,
  selectedRobot,
  onToggleRemoteControl,
  onToggleEStop,
}) {
  return (
    <Card className={`sticky bottom-3 z-50 rounded-[2rem] border p-4 sm:bottom-4 lg:p-5 ${getEStopCardClass(isEStopActive)}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl ${
              isEStopActive ? 'bg-status-danger/16 text-status-danger' : 'bg-white/[0.05] text-primary'
            }`}>
              {isEStopActive ? <ShieldAlert className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Safety Controls</div>
              <div className="mt-1 text-base font-semibold text-white">E-STOP 紧急停止</div>
              <div className="mt-1 text-sm text-gray-500">
                {isEStopActive ? '所有视频与遥测流已冻结，等待人工复位' : '一键触发全系统暂停与日志报警'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-sm">
            <div className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-gray-300">
              <span className="mr-2 text-gray-500">对象</span>
              <span className="text-white">{selectedRobot.id}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-gray-300">
              <Battery className="h-4 w-4 text-primary" />
              电量 {selectedRobot.battery}%
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-gray-300">
              <Wifi className="h-4 w-4 text-status-success" />
              信号 {getSignalLabel(selectedRobot.signal)}
            </div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 ${
              isRemoteControl
                ? 'border-primary/18 bg-primary/10 text-primary'
                : 'border-white/8 bg-white/[0.03] text-gray-300'
            }`}>
              <Radio className="h-4 w-4" />
              控制模式 {isRemoteControl ? '远程' : '本地'}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Button
            variant={isRemoteControl ? 'primary' : 'outline'}
            size="md"
            className="w-full rounded-full px-5 py-3 sm:w-auto"
            onClick={onToggleRemoteControl}
          >
            <Radio className="mr-2 h-[18px] w-[18px]" />
            {isRemoteControl ? '断开远程接管' : '远程接管'}
          </Button>
          <Button
            variant={isEStopActive ? 'secondary' : 'danger'}
            size="md"
            className={`w-full rounded-full px-6 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(239,68,68,0.18)] sm:w-auto ${
              isEStopActive ? 'border border-status-danger/16 bg-status-danger/12 text-status-danger hover:bg-status-danger/18' : ''
            }`}
            onClick={onToggleEStop}
          >
            <AlertCircle className="mr-2 h-[18px] w-[18px]" />
            {isEStopActive ? '解除 E-STOP' : 'E-STOP'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
