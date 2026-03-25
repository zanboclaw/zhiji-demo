import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { Layout } from './components/layout/Layout'
import { I18nProvider } from './i18n'
import { useI18n } from './i18n/context'
import { readAuthState, writeAuthState } from './utils/auth'

const HomePage = lazy(() => import('./pages/HomePage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const SimulationPage = lazy(() => import('./pages/SimulationPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

function RouteFallback() {
  const { messages } = useI18n()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#06080d_0%,#050505_100%)]">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
          <Bot className="h-7 w-7 animate-pulse" />
        </div>
        <div className="mt-5 text-sm uppercase tracking-[0.3em] text-primary/70">{messages.app.loadingLabel}</div>
        <div className="mt-2 text-lg font-medium text-white">{messages.app.loadingTitle}</div>
      </div>
    </div>
  )
}

function ProtectedRoute({ isAuthenticated, children }) {
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readAuthState())

  const handleLogin = () => {
    writeAuthState(true)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    writeAuthState(false)
    setIsAuthenticated(false)
  }

  return (
    <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HomePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/marketplace"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MarketplacePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/simulation"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SimulationPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DashboardPage />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App
