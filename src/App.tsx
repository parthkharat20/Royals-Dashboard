import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { ExecutiveBrief } from '@/pages/ExecutiveBrief'
import { PressureIntelligence } from '@/pages/PressureIntelligence'
import { ModelTrust } from '@/pages/ModelTrust'
import { PlayerInvestigation } from '@/pages/PlayerInvestigation'
import { SquadImpact } from '@/pages/SquadImpact'

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<ExecutiveBrief />} />
          <Route path="/pressure" element={<PressureIntelligence />} />
          <Route path="/methodology" element={<ModelTrust />} />
          <Route path="/player/:id" element={<PlayerInvestigation />} />
          <Route path="/squad" element={<SquadImpact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
