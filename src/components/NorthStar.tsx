'use client'

import { usePipeline } from '@/hooks/usePipeline'
import Sparkline from '@/components/charts/Sparkline'

// Real actuals from financials sheet (EUR)
const REVENUE_MONTHS = [
  { label: 'JAN', value: 42741 },
  { label: 'FEB', value: 30003 },
  { label: 'MAR', value: 39615 },
  { label: 'APR', value: 47900 },
  { label: 'MAY', value: 27090 }, // partial — pipeline covers gap
]

const CURRENT_MRR = 47900  // April — latest full month
const TARGET = 1000000
const MILESTONE_80K = 80000
const MILESTONE_100K = 100000

const fmt = (n: number) =>
  n >= 1000 ? `€${(n / 1000).toFixed(0)}K` : `€${n}`

const fmtPipeline = (n: number) =>
  `$${(n / 1000).toFixed(0)}K`

export default function NorthStar() {
  const { data } = usePipeline()
  const pct = (CURRENT_MRR / TARGET) * 100
  const mom = ((CURRENT_MRR - REVENUE_MONTHS[REVENUE_MONTHS.length - 2].value) / REVENUE_MONTHS[REVENUE_MONTHS.length - 2].value) * 100

  return (
    <div className="panel p-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">
        ◈ NORTH STAR — REVENUE COMMAND
      </div>

      {/* MRR + sparkline row */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-0.5">
            Monthly Revenue
          </div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-green-400" style={{ textShadow: '0 0 16px #4ade8066' }}>
              {fmt(CURRENT_MRR)}
            </div>
            <div className={`text-xs font-bold mb-1 ${mom >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {mom >= 0 ? '↑' : '↓'}{Math.abs(mom).toFixed(0)}% MoM
            </div>
          </div>
          <div className="text-[10px] text-text-secondary mt-0.5">
            Target: {fmt(TARGET)} by end of 2026
          </div>
        </div>

        {/* Revenue sparkline — real data */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-[8px] tracking-widest text-[#334155]">JAN–MAY</div>
          <Sparkline
            data={REVENUE_MONTHS.map(m => m.value)}
            width={80}
            height={36}
            color="#4ade80"
            threshold={MILESTONE_80K}
          />
          <div className="flex gap-2">
            {REVENUE_MONTHS.map(m => (
              <div key={m.label} className="text-[6px] text-[#334155] text-center w-[14px]">
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track mt-1 mb-1">
        <div
          className="progress-fill bg-gradient-to-r from-blue-600 to-green-400"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {/* Milestones */}
      <div className="flex text-[9px] text-text-secondary justify-between mb-4 mt-1">
        <span>€0</span>
        <span className={CURRENT_MRR >= MILESTONE_80K ? 'text-green-400' : 'text-amber-400'}>€80K</span>
        <span className={CURRENT_MRR >= MILESTONE_100K ? 'text-green-400' : 'text-text-secondary'}>€100K</span>
        <span className={CURRENT_MRR >= 500000 ? 'text-green-400' : 'text-text-secondary'}>€500K</span>
        <span>€1M</span>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-4 gap-2 border-t border-border-dim pt-3">
        <Metric
          label="Open Pipeline"
          value={data ? fmtPipeline(data.open_value) : '—'}
          color="blue"
        />
        <Metric
          label="Active Deals"
          value={data ? `${data.open_count}` : '—'}
          color="green"
        />
        <Metric label="Outbound" value="ACTIVE" color="green" />
        <Metric label="Next Target" value="€80K" color="amber" />
      </div>

      {/* Deal stage breakdown */}
      {data && (
        <div className="mt-3 pt-3 border-t border-border-dim flex gap-3 text-[9px]">
          <StageChip label="IN PROGRESS" count={data.in_progress} color="text-green-400" />
          <StageChip label="PROPOSAL" count={data.proposal_sent} color="text-blue-400" />
          <StageChip label="NURTURE" count={data.nurture} color="text-amber-400" />
          <div className="ml-auto text-text-secondary opacity-40">
            synced {new Date(data.refreshed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClass: Record<string, string> = {
    blue: 'text-blue-400', green: 'text-green-400',
    amber: 'text-amber-400', red: 'text-red-400', purple: 'text-purple-400',
  }
  return (
    <div className="text-center">
      <div className={`text-sm font-bold ${colorClass[color] ?? 'text-text-primary'}`}>{value}</div>
      <div className="text-[9px] text-text-secondary uppercase tracking-wide mt-0.5">{label}</div>
    </div>
  )
}

function StageChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`font-bold ${color}`}>{count}</span>
      <span className="text-text-secondary tracking-widest">{label}</span>
    </div>
  )
}
