'use client'

import { usePipeline } from '@/hooks/usePipeline'

const MRR = 42000        // current MRR — update manually when it changes
const TARGET = 1000000

const fmt = (n: number) =>
  n >= 1000 ? `€${(n / 1000).toFixed(0)}K` : `€${n}`

const fmtPipeline = (n: number) =>
  `$${(n / 1000).toFixed(0)}K`

export default function NorthStar() {
  const { data } = usePipeline()
  const pct = (MRR / TARGET) * 100

  return (
    <div className="panel p-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">
        ◈ NORTH STAR — REVENUE COMMAND
      </div>

      <div className="flex items-end justify-between mb-1">
        <div>
          <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-0.5">
            Monthly Revenue
          </div>
          <div className="text-3xl font-bold text-green-400 text-glow-green">
            {fmt(MRR)}
          </div>
          <div className="text-[10px] text-text-secondary mt-0.5">
            Target: {fmt(TARGET)} by end of 2026
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-0.5">
            Progress
          </div>
          <div className="text-2xl font-bold text-blue-400 text-glow-blue">
            {pct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track mt-3 mb-4">
        <div
          className="progress-fill bg-gradient-to-r from-blue-600 to-green-400"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Milestones */}
      <div className="flex text-[9px] text-text-secondary justify-between mb-4 -mt-2">
        <span>€0</span>
        <span className={MRR >= 80000 ? 'text-green-400' : 'text-amber-400'}>€80K</span>
        <span className={MRR >= 100000 ? 'text-green-400' : 'text-text-secondary'}>€100K</span>
        <span className={MRR >= 500000 ? 'text-green-400' : 'text-text-secondary'}>€500K</span>
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
        <Metric
          label="Outbound"
          value="ACTIVE"
          color="green"
        />
        <Metric label="Next Milestone" value="€80K" color="amber" />
      </div>

      {/* Deal stage breakdown */}
      {data && (
        <div className="mt-3 pt-3 border-t border-border-dim flex gap-3 text-[9px]">
          <StageChip label="IN PROGRESS" count={data.in_progress} color="text-green-400" />
          <StageChip label="PROPOSAL" count={data.proposal_sent} color="text-blue-400" />
          <StageChip label="NURTURE" count={data.nurture} color="text-amber-400" />
          <div className="ml-auto text-text-secondary opacity-50">
            synced {new Date(data.refreshed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClass: Record<string, string> = {
    blue:   'text-blue-400',
    green:  'text-green-400',
    amber:  'text-amber-400',
    red:    'text-red-400',
    purple: 'text-purple-400',
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
