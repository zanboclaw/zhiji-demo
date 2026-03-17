import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, Cpu, LayoutDashboard } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/marketplace', label: '技能市场', icon: ShoppingBag },
  { path: '/simulation', label: '仿真工作室', icon: Cpu },
  { path: '/dashboard', label: '监控台', icon: LayoutDashboard },
]

export function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background-secondary/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-purple rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">
                知肌纪
              </span>
            </Link>

            {/* 导航链接 */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? 'text-primary'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
