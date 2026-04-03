'use client'

import ArcGauge from '@/components/charts/ArcGauge'
import Sparkline from '@/components/charts/Sparkline'

// Dummy data — replace with weekly_scores from Supabase once built
const DUMMY_WEEKS = [28, 31, 35, 38, 36, 41, 44]

const LAYERS = [
  { key: 'revenue',    label: 'TREASURY',    score: 58, weight: 25, color: '#4ade80', sparkData: [42, 30, 40, 48, 27] },
  { key: 'pipeline',   label: 'TRADE ROUTES', score: 65, weight: 20, color: '#60a5fa', sparkData: [30, 45, 38, 50, 50] },
  { key: 'calls',      label: 'SCOUTING',    score: 45, weight: 30, color: '#a78bfa', sparkData: [1, 2, 1, 3, 2, 2, 3] },
  { key: 'outbound',   label: 'EXPEDITIONS', score: 5,  weight: 15, color: '#f59e0b', sparkData: [0, 0, 2, 0, 0, 0, 0] },
  { key: 'assets',     label: 'OUTPOSTS',    score: 20, weight: 10, color: '#f472b6', sparkData: [30, 28, 25, 22, 20] },
]

const MISSION_SCORE = Math.round(
  LAYERS.reduce((acc, l) => acc + (l.score * l.weight) / 100, 0)
)

function LayerBar({ label, score, color, weight, sparkData }: typeof LAYERS[0]) {
  const pct = score
  const barColor = pct >= 65 ? '#4ade80' : pct >= 35 ? color : '#ef4444'

  return (
    <div className="flex items-center gap-2">
      {/* Label */}
      <div className="text-[8px] font-bold tracking-widest text-[#475569] w-[76px] flex-shrink-0">
        {label}
      </div>

      {/* Bar track */}
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}88` }}
        />
      </div>

      {/* Score number */}
      <div className="text-[9px] font-bold w-6 text-right flex-shrink-0" style={{ color: barColor }}>
        {score}
      </div>

      {/* Sparkline */}
      <div className="flex-shrink-0 opacity-70">
        <Sparkline data={sparkData} width={36} height={12} color={color} showArea={false} strokeWidth={1} />
      </div>

      {/* Weight badge */}
      <div className="text-[7px] text-[#334155] w-5 flex-shrink-0 text-right">
        ×{weight}%
      </div>
    </div>
  )
}

export default function MissionScore() {
  const scoreLabel = MISSION_SCORE >= 65 ? 'NOMINAL' : MISSION_SCORE >= 35 ? 'AT RISK' : 'CRITICAL'
  const scoreLabelColor = MISSION_SCORE >= 65 ? '#4ade80' : MISSION_SCORE >= 35 ? '#f59e0b' : '#ef4444'

  return (
    <div className="panel p-4 flex flex-col gap-4">
      <div className="panel-header -mx-4 -mt-4 mb-0">
        ◈ MISSION SCORE — COLONY STATUS
      </div>

      {/* Score + trend row */}
      <div className="flex items-center gap-6">
        {/* Arc gauge */}
        <ArcGauge
          value={MISSION_SCORE}
          size={110}
          strokeWidth={8}
          sublabel="OVERALL"
        />

        {/* Right side */}
        <div className="flex flex-col gap-3 flex-1">
          {/* Status label */}
          <div>
            <div className="text-[8px] tracking-widest text-[#475569] mb-1">COLONY STATUS</div>
            <div
              className="text-sm font-bold tracking-[0.2em]"
              style={{ color: scoreLabelColor, textShadow: `0 0 8px ${scoreLabelColor}66` }}
            >
              {scoreLabel}
            </div>
          </div>

          {/* Weekly trend sparkline */}
          <div>
            <div className="text-[8px] tracking-widest text-[#475569] mb-1">7-WEEK TREND</div>
            <Sparkline
              data={DUMMY_WEEKS}
              width={120}
              height={28}
              color="#60a5fa"
              threshold={60}
            />
          </div>

          {/* Mini stats */}
          <div className="flex gap-4">
            <div>
              <div className="text-[8px] text-[#475569]">THIS WEEK</div>
              <div className="text-xs font-bold text-blue-400">{MISSION_SCORE}</div>
            </div>
            <div>
              <div className="text-[8px] text-[#475569]">LAST WEEK</div>
              <div className="text-xs font-bold text-[#64748b]">{DUMMY_WEEKS[DUMMY_WEEKS.length - 2]}</div>
            </div>
            <div>
              <div className="text-[8px] text-[#475569]">TARGET</div>
              <div className="text-xs font-bold text-[#64748b]">60</div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Layer breakdown */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[8px] tracking-[0.2em] text-[#334155] mb-1">LAYER BREAKDOWN</div>
        {LAYERS.map(l => <LayerBar key={l.key} {...l} />)}
      </div>

      {/* Warning: critical layer */}
      <div className="border border-amber-900/40 bg-amber-950/20 rounded px-3 py-2 flex items-start gap-2">
        <span className="text-amber-400 text-xs mt-px">⚠</span>
        <div>
          <div className="text-[9px] font-bold text-amber-400 tracking-widest">EXPEDITIONS CRITICAL</div>
          <div className="text-[9px] text-[#64748b] mt-0.5">No outbound sequences active. Sales agent idle. Colony not expanding.</div>
        </div>
      </div>
    </div>
  )
}
