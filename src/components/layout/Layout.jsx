import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, Cpu, LayoutDashboard, Bell, Bot } from 'lucide-react'
import { Button } from '../ui'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/marketplace', label: 'AI 技能市场', icon: ShoppingBag },
  { path: '/simulation', label: '仿真工作室', icon: Cpu },
  { path: '/dashboard', label: 'OS 监控台', icon: LayoutDashboard },
]

export function Layout({ children }) {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('robot-figma-login') === 'true'
    setIsLoggedIn(stored)
  }, [])

  const toggleLogin = () => {
    const nextValue = !isLoggedIn
    setIsLoggedIn(nextValue)
    window.localStorage.setItem('robot-figma-login', String(nextValue))
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background-secondary/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-cyan-400 to-accent-purple shadow-[0_0_24px_rgba(59,130,246,0.35)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.26em] text-primary/80">
                Robot Figma
              </div>
              <div className="text-lg font-semibold text-white">知肌纪</div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-primary/40 bg-primary/15"
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={toggleLogin}
                  className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:text-white sm:flex"
                  title="切换登录态"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-status-danger" />
                </button>
                <button
                  type="button"
                  onClick={toggleLogin}
                  className="flex items-center gap-3 rounded-full border border-primary/30 bg-white/5 px-2 py-1 pr-4"
                  title="切换登录态"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-purple text-sm font-semibold text-white">
                    Z
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-medium text-white">展博</div>
                    <div className="text-xs text-gray-500">3 条待处理通知</div>
                  </div>
                </button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={toggleLogin}>
                登录 / 注册
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-16">{children}</main>
    </div>
  )
}
