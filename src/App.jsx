import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './components/home/Home'
import { Marketplace } from './components/marketplace/Marketplace'
import { SimulationStudio } from './components/simulation/SimulationStudio'
import { Dashboard } from './components/dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/simulation" element={<SimulationStudio />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
