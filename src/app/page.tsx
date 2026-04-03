import Starfield from '@/components/Starfield'
import PlanetScene from '@/components/PlanetScene'
import CockpitFrame from '@/components/CockpitFrame'

export default function Home() {
  return (
    <div className="scanline fixed inset-0 overflow-hidden" style={{ background: 'var(--bg-void)' }}>
      {/* Layer 0: Animated starfield canvas */}
      <Starfield />

      {/* Layer 1: Planet + colony scene */}
      <PlanetScene />

      {/* Layer 2: Cockpit UI frame (panels, monitors, HUD) */}
      <CockpitFrame />
    </div>
  )
}
