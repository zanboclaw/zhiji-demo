import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { Layout } from './components/layout/Layout'

const Home = lazy(() =>
  import('./components/home/Home').then((module) => ({ default: module.Home })),
)
const Marketplace = lazy(() =>
  import('./components/marketplace/Marketplace').then((module) => ({
    default: module.Marketplace,
  })),
)
const SimulationStudio = lazy(() =>
  import('./components/simulation/SimulationStudio').then((module) => ({
    default: module.SimulationStudio,
  })),
)
const Dashboard = lazy(() =>
  import('./components/dashboard/Dashboard').then((module) => ({
    default: module.Dashboard,
  })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#06080d_0%,#050505_100%)]">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
          <Bot className="h-7 w-7 animate-pulse" />
        </div>
        <div className="mt-5 text-sm uppercase tracking-[0.3em] text-primary/70">Loading Workspace</div>
        <div className="mt-2 text-lg font-medium text-white">正在加载高保真演示模块</div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/simulation" element={<SimulationStudio />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default App
