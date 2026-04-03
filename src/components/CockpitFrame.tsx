'use client'

import Clock from '@/components/Clock'
import CockpitMonitor from '@/components/CockpitMonitor'
import AgentStations from '@/components/AgentStation'
import NorthStar from '@/components/NorthStar'
import Commander from '@/components/Commander'
import MissionLog from '@/components/MissionLog'
import AlertPanel from '@/components/AlertPanel'
import ResourcePipeline from '@/components/ResourcePipeline'

// Decorative readout rows for side panels
function Readout({ label, value, color = '#2563eb' }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-0.5 border-b border-[#1e2a3a]/50">
      <span className="text-[8px] tracking-widest text-[#64748b] uppercase">{label}</span>
      <span className="text-[8px] font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

function BlinkDot({ color = '#22c55e', interval = 2000 }: { color?: string; interval?: number }) {
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{
        width: 5,
        height: 5,
        background: color,
        animation: `pulse-glow ${interval}ms ease-in-out infinite`,
      }}
    />
  )
}

function VerticalLabel({ text }: { text: string }) {
  return (
    <div
      className="text-[8px] tracking-[0.3em] text-[#1e2a3a] font-bold uppercase select-none"
      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
    >
      {text}
    </div>
  )
}

export default function CockpitFrame() {
  return (
    <div className="fixed inset-0 z-20 flex flex-col pointer-events-none select-none">

      {/* ═══════════════ TOP BAR ═══════════════ */}
      <header
        className="flex items-center justify-between px-4 py-2 border-b border-[#1e2a3a] flex-shrink-0 pointer-events-auto"
        style={{ background: 'rgba(6,8,16,0.85)', backdropFilter: 'blur(4px)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#2563eb]">◈</span>
          <span className="text-sm font-bold tracking-[0.2em] text-blue-400" style={{ textShadow: '0 0 8px rgba(59,130,246,0.5)' }}>
            MISSION CONTROL
          </span>
          <span className="text-[10px] text-[#64748b]">—</span>
          <span className="text-[10px] text-[#64748b] tracking-widest">ADASIGHT COLONY</span>
          {/* Status dots */}
          <div className="flex items-center gap-2 ml-4">
            <BlinkDot color="#22c55e" />
            <span className="text-[9px] text-green-400">LIFE SUPPORT</span>
            <BlinkDot color="#60a5fa" interval={3000} />
            <span className="text-[9px] text-blue-400">COMMS</span>
            <BlinkDot color="#f59e0b" interval={4000} />
            <span className="text-[9px] text-amber-400">SHIELDS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[#64748b]">
            SECTOR: <span className="text-blue-400">BARCELONA · UTC+2</span>
          </span>
          <Clock />
          <div className="flex items-center gap-1.5">
            <BlinkDot color="#22c55e" />
            <span className="text-[10px] text-green-400">SYSTEMS ONLINE</span>
          </div>
        </div>
      </header>

      {/* ═══════════════ MAIN COCKPIT ROW ═══════════════ */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT COCKPIT PANEL ── */}
        <aside
          className="flex flex-col gap-2 p-2 border-r border-[#1e2a3a] flex-shrink-0 pointer-events-auto"
          style={{ width: 150, background: 'rgba(6,8,16,0.82)', backdropFilter: 'blur(4px)' }}
        >
          {/* Vertical identity */}
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[8px] tracking-[0.2em] text-[#64748b] uppercase">PORT-A</span>
            <VerticalLabel text="COMMANDER BRIDGE" />
          </div>

          {/* Commander monitor */}
          <CockpitMonitor
            label="BRIDGE"
            icon="🎖"
            statusText="GREGOR"
            statusColor="blue"
            orientation="vertical"
          >
            <Commander />
          </CockpitMonitor>

          {/* Decorative readouts */}
          <div className="border border-[#1e2a3a] rounded mt-1" style={{ background: 'rgba(4,6,14,0.6)' }}>
            <div className="text-[8px] tracking-widest text-[#64748b] px-2 py-1 border-b border-[#1e2a3a]">
              SYS READOUT
            </div>
            <Readout label="HULL" value="100%" color="#22c55e" />
            <Readout label="POWER" value="94%" color="#60a5fa" />
            <Readout label="OXYGEN" value="98%" color="#22c55e" />
            <Readout label="FUEL" value="67%" color="#f59e0b" />
            <Readout label="THRUST" value="NOMINAL" color="#22c55e" />
          </div>

          {/* Panel lines decoration */}
          <div className="flex flex-col gap-1 mt-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-px" style={{ background: `rgba(37,99,235,${0.04 + i * 0.02})` }} />
            ))}
            <div className="flex items-center gap-1 px-1 pt-1">
              <BlinkDot color="#22c55e" interval={2500} />
              <span className="text-[7px] text-[#64748b] tracking-widest">ACTIVE</span>
            </div>
          </div>
        </aside>

        {/* ── CENTER: transparent viewport (planet shows through) ── */}
        <div className="flex-1 relative min-w-0">
          {/* Targeting reticle corners */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#2563eb]/30" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#2563eb]/30" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#2563eb]/30" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#2563eb]/30" />
        </div>

        {/* ── RIGHT COCKPIT PANEL ── */}
        <aside
          className="flex flex-col gap-2 p-2 border-l border-[#1e2a3a] flex-shrink-0 pointer-events-auto"
          style={{ width: 150, background: 'rgba(6,8,16,0.82)', backdropFilter: 'blur(4px)' }}
        >
          <div className="flex items-center justify-between px-1 mb-1">
            <VerticalLabel text="STARBOARD COMMS" />
            <span className="text-[8px] tracking-[0.2em] text-[#64748b] uppercase">STBD-A</span>
          </div>

          {/* Mission Log monitor */}
          <CockpitMonitor
            label="LOG"
            icon="📡"
            statusText="LIVE FEED"
            statusColor="cyan"
            orientation="vertical"
          >
            <MissionLog />
          </CockpitMonitor>

          {/* Alert Panel monitor */}
          <CockpitMonitor
            label="ALERTS"
            icon="⚠"
            statusText="MONITOR"
            statusColor="amber"
            orientation="vertical"
          >
            <AlertPanel />
          </CockpitMonitor>

          {/* Decorative telemetry */}
          <div className="border border-[#1e2a3a] rounded mt-1" style={{ background: 'rgba(4,6,14,0.6)' }}>
            <div className="text-[8px] tracking-widest text-[#64748b] px-2 py-1 border-b border-[#1e2a3a]">
              TELEMETRY
            </div>
            <Readout label="AGENTS" value="6 CREW" color="#60a5fa" />
            <Readout label="UPLINK" value="STRONG" color="#22c55e" />
            <Readout label="LAT" value="12 MS" color="#22c55e" />
            <Readout label="MRR" value="€42K" color="#4ade80" />
            <Readout label="TARGET" value="€1M" color="#f59e0b" />
          </div>

          <div className="flex flex-col gap-1 mt-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-px" style={{ background: `rgba(37,99,235,${0.04 + i * 0.02})` }} />
            ))}
            <div className="flex items-center justify-end gap-1 px-1 pt-1">
              <span className="text-[7px] text-[#64748b] tracking-widest">LINKED</span>
              <BlinkDot color="#60a5fa" interval={1800} />
            </div>
          </div>
        </aside>
      </div>

      {/* ═══════════════ BOTTOM CONSOLE ═══════════════ */}
      <footer
        className="flex flex-col border-t border-[#1e2a3a] flex-shrink-0 pointer-events-auto"
        style={{ background: 'rgba(6,8,16,0.88)', backdropFilter: 'blur(4px)' }}
      >
        {/* Console header strip */}
        <div className="flex items-center justify-between px-4 py-1 border-b border-[#1e2a3a]/50">
          <span className="text-[8px] tracking-[0.3em] text-[#64748b] uppercase">Main Console — NAV GRID</span>
          <div className="flex items-center gap-3">
            <span className="text-[8px] text-[#64748b]">ADASIGHT MISSION CONTROL v0.2.0 — CLASSIFIED</span>
            <BlinkDot color="#22c55e" />
          </div>
        </div>

        {/* 4 monitor row */}
        <div className="grid grid-cols-4 gap-2 p-2">

          {/* BRIDGE — Agent Stations */}
          <CockpitMonitor
            label="CREW STATIONS"
            icon="🤖"
            statusText="6 AGENTS"
            statusColor="green"
            overlayContent={
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#64748b] mb-4 uppercase">
                  ◈ Crew Stations — Agent Fleet Status
                </div>
                <AgentStations />
              </div>
            }
          >
            <AgentStations />
          </CockpitMonitor>

          {/* WAR ROOM — NorthStar + Pipelines */}
          <CockpitMonitor
            label="WAR ROOM"
            icon="🎯"
            statusText="€42K MRR"
            statusColor="green"
            overlayContent={
              <div className="flex flex-col gap-4">
                <NorthStar />
                <ResourcePipeline />
              </div>
            }
          >
            <div className="flex flex-col gap-4">
              <NorthStar />
              <ResourcePipeline />
            </div>
          </CockpitMonitor>

          {/* GROWTH LAB — ResourcePipeline */}
          <CockpitMonitor
            label="GROWTH LAB"
            icon="📊"
            statusText="3 PIPELINES"
            statusColor="purple"
            overlayContent={
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#64748b] mb-4 uppercase">
                  ◈ Resource Pipelines — Growth Engine
                </div>
                <ResourcePipeline />
              </div>
            }
          >
            <ResourcePipeline />
          </CockpitMonitor>

          {/* COMMS — Full Mission Log */}
          <CockpitMonitor
            label="COMMS"
            icon="📻"
            statusText="LIVE"
            statusColor="cyan"
            overlayContent={
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#64748b] mb-4 uppercase">
                  ◈ Mission Log — Full Ship&apos;s Record
                </div>
                <MissionLog />
              </div>
            }
          >
            <MissionLog />
          </CockpitMonitor>
        </div>
      </footer>
    </div>
  )
}
