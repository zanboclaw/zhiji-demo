import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, Cpu, LayoutDashboard, LogOut, Bot } from 'lucide-react'
import { useI18n } from '../../i18n/context'
import { LocaleSwitcher } from '../ui/LocaleSwitcher'

export function Layout({ children, isAuthenticated, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === '/login'
  const { messages } = useI18n()

  const navItems = [
    { path: '/', label: messages.layout.nav.home, icon: Home },
    { path: '/marketplace', label: messages.layout.nav.marketplace, icon: ShoppingBag },
    { path: '/simulation', label: messages.layout.nav.simulation, icon: Cpu },
    { path: '/dashboard', label: messages.layout.nav.dashboard, icon: LayoutDashboard },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      {!isLoginPage ? (
        <nav className="fixed left-0 right-0 top-0 z-50 px-2 pt-3 sm:px-4 lg:px-5">
          <div className="mx-auto max-w-[1440px]">
            <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.9),rgba(5,8,14,0.94))] shadow-[0_24px_70px_rgba(2,6,23,0.34)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-14 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_62%)]" />
              <div className="pointer-events-none absolute -left-12 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18),transparent_68%)] blur-2xl" />
              <div className="pointer-events-none absolute -right-10 top-3 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_70%)] blur-2xl" />
              <div className="flex flex-col gap-3 px-3 py-3 sm:px-4 lg:px-5">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/"
                    className="group flex min-w-0 items-center gap-3 rounded-[1.35rem] border border-transparent px-2.5 py-2 transition-all duration-200 hover:border-white/8 hover:bg-white/[0.04]"
                  >
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] bg-[linear-gradient(135deg,#fb923c_0%,#38bdf8_58%,#8b5cf6_100%)] shadow-[0_14px_34px_rgba(59,130,246,0.28)]">
                      <div className="absolute inset-[1px] rounded-[1.05rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_46%),rgba(8,12,18,0.18)]" />
                      <Bot className="relative z-10 h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary/80 sm:text-[11px]">
                          Robot Figma
                        </div>
                        <div className="hidden h-1 w-1 rounded-full bg-emerald-400/80 sm:block" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[1.05rem] font-semibold leading-none text-white sm:text-[1.15rem]">
                          {messages.layout.brandName}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="hidden min-w-0 flex-1 justify-center md:flex">
                    <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`group relative flex items-center gap-2 rounded-[1rem] px-3.5 py-2 text-sm font-medium transition-all duration-200 lg:px-4 ${
                              isActive
                                ? 'text-white'
                                : 'text-gray-400 hover:-translate-y-0.5 hover:text-gray-100'
                            }`}
                          >
                            {isActive ? (
                              <motion.div
                                layoutId="nav-pill"
                                className="absolute inset-0 rounded-[1rem] border border-primary/35 bg-[linear-gradient(180deg,rgba(249,115,22,0.16),rgba(249,115,22,0.08))] shadow-[0_12px_26px_rgba(249,115,22,0.16)]"
                              />
                            ) : null}
                            <span className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                              isActive
                                ? 'border-primary/20 bg-white/10 text-primary'
                                : 'border-transparent bg-transparent text-gray-500 group-hover:border-white/10 group-hover:bg-white/[0.05] group-hover:text-white'
                            }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <LocaleSwitcher className="border-transparent bg-transparent px-2.5 py-2 hover:bg-white/[0.04]" />
                      {isAuthenticated ? (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="group flex items-center gap-3 rounded-[1rem] border border-transparent bg-transparent px-2.5 py-2 pr-3 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                          title={messages.layout.logoutTitle}
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f97316,#8b5cf6)] text-sm font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.16)]">
                            Z
                          </div>
                          <div className="hidden text-left lg:block">
                            <div className="text-sm font-medium text-white">admin</div>
                            <div className="text-xs text-gray-500">{messages.layout.logoutHint}</div>
                          </div>
                          <LogOut className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="md:hidden">
                  <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-1.5">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex shrink-0 items-center gap-2 rounded-[0.95rem] border px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? 'border-primary/30 bg-primary/12 text-white'
                              : 'border-transparent bg-transparent text-gray-400'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      ) : null}

      <main className={isLoginPage ? '' : 'pt-[8.75rem] md:pt-[6.75rem]'}>{children}</main>
    </div>
  )
}
