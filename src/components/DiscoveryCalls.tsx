'use client'

import ArcGauge from '@/components/charts/ArcGauge'
import Sparkline from '@/components/charts/Sparkline'

// Dummy / seed data — replace with discovery_log Supabase query
const THIS_WEEK = 3
const TARGET = 5
const LAST_8_WEEKS = [1, 2, 1, 3, 2, 0, 2, 3]

const RECENT_CALLS = [
  { date: '2026-04-01', company: 'Via Amplitude', source: 'Amplitude Referral', outcome: 'Qualified' },
  { date: '2026-04-01', company: 'Via Amplitude', source: 'Amplitude Referral', outcome: 'Qualified' },
  { date: '2026-03-31', company: 'Via Amplitude', source: 'Amplitude Referral', outcome: 'Follow-up' },
  { date: '2026-03-25', company: '—', source: 'Inbound', outcome: 'Qualified' },
  { date: '2026-03-24', company: '—', source: 'Outbound', outcome: 'Not fit' },
]

const SOURCE_COLORS: Record<string, string> = {
  'Amplitude Referral': '#60a5fa',
  'Inbound': '#4ade80',
  'Outbound': '#a78bfa',
  'Upwork': '#f59e0b',
}

const OUTCOME_COLORS: Record<string, string> = {
  'Qualified':   '#4ade80',
  'Follow-up':   '#f59e0b',
  'Not fit':     '#ef4444',
  'Proposal sent': '#60a5fa',
}

export default function DiscoveryCalls() {
  const pct = (THIS_WEEK / TARGET) * 100
  const dayOfWeek = new Date().getDay() // 0=Sun, 5=Fri
  const daysLeft = Math.max(0, 5 - dayOfWeek) // days left in work week
  const onTrack = THIS_WEEK >= Math.round((TARGET * (5 - daysLeft)) / 5)

  return (
    <div className="panel p-4 flex flex-col gap-4">
      <div className="panel-header -mx-4 -mt-4 mb-0">
        ◈ SCOUTING MISSIONS — DISCOVERY CALLS
      </div>

      {/* Quota row */}
      <div className="flex items-center gap-6">
        {/* Arc gauge */}
        <ArcGauge
          value={THIS_WEEK}
          max={TARGET}
          size={90}
          strokeWidth={7}
          color={onTrack ? '#4ade80' : '#f59e0b'}
          label={`${THIS_WEEK}/${TARGET}`}
          sublabel="THIS WEEK"
          scoreColor={false}
        />

        <div className="flex flex-col gap-3 flex-1">
          {/* Status */}
          <div>
            <div className="text-[8px] tracking-widest text-[#475569] mb-1">STATUS</div>
            <div className={`text-xs font-bold tracking-widest ${onTrack ? 'text-green-400' : 'text-amber-400'}`}>
              {onTrack ? '✓ ON TRACK' : `⚠ NEED ${TARGET - THIS_WEEK} MORE`}
            </div>
          </div>

          {/* 8-week sparkline */}
          <div>
            <div className="text-[8px] tracking-widest text-[#475569] mb-1">8-WEEK HISTORY</div>
            <Sparkline
              data={LAST_8_WEEKS}
              width={110}
              height={24}
              color="#a78bfa"
              threshold={TARGET}
            />
            <div className="text-[7px] text-[#334155] mt-0.5 text-right">— target: {TARGET}/wk</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Source breakdown */}
      <div>
        <div className="text-[8px] tracking-widest text-[#334155] mb-2">SOURCE THIS WEEK</div>
        <div className="flex gap-3">
          {Object.entries(
            RECENT_CALLS.filter(c => c.date >= '2026-03-30').reduce((acc, c) => {
              acc[c.source] = (acc[c.source] || 0) + 1
              return acc
            }, {} as Record<string, number>)
          ).map(([source, count]) => (
            <div key={source} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: SOURCE_COLORS[source] ?? '#64748b' }} />
              <span className="text-[9px]" style={{ color: SOURCE_COLORS[source] ?? '#64748b' }}>{count}×</span>
              <span className="text-[8px] text-[#475569]">{source}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent calls log */}
      <div>
        <div className="text-[8px] tracking-widest text-[#334155] mb-2">RECENT CONTACTS</div>
        <div className="flex flex-col gap-1">
          {RECENT_CALLS.slice(0, 4).map((call, i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1 bg-white/[0.02] rounded text-[9px]">
              <span className="text-[#475569] w-20 flex-shrink-0">{call.date.slice(5)}</span>
              <span className="text-[#94a3b8] flex-1 truncate">{call.company}</span>
              <span className="text-[8px] flex-shrink-0 ml-2" style={{ color: SOURCE_COLORS[call.source] ?? '#64748b' }}>
                {call.source.split(' ')[0]}
              </span>
              <span className="text-[8px] flex-shrink-0 ml-2 w-16 text-right" style={{ color: OUTCOME_COLORS[call.outcome] ?? '#64748b' }}>
                {call.outcome}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
