'use client'

import { useEffect, useState } from 'react'
import { supabase, AgentHandover } from '@/lib/supabase'

function formatTime(ts: string): string {
  const d = new Date(ts)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function LogEntry({ h }: { h: AgentHandover }) {
  const isCompleted = h.status === 'completed'
  const isPending = h.status === 'pending'

  return (
    <div className={`border-l-2 pl-3 py-1 text-[11px] ${
      isCompleted ? 'border-green-500/50' :
      isPending   ? 'border-amber-500/60' :
                    'border-blue-500/40'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className={`font-bold ${isCompleted ? 'text-green-400' : isPending ? 'text-amber-400' : 'text-blue-400'}`}>
          {isCompleted ? '✓ MISSION COMPLETE' : isPending ? '⟳ INCOMING TRANSMISSION' : '◎ ACKNOWLEDGED'}
        </span>
        <span className="text-text-secondary text-[10px] flex-shrink-0">{formatTime(h.created_at)}</span>
      </div>
      <div className="text-text-primary font-medium mb-0.5">{h.title}</div>
      <div className="text-text-secondary text-[10px]">
        {h.from_agent} → {h.to_agent}
      </div>
      {h.description && (
        <div className="text-text-secondary mt-0.5 text-[10px] line-clamp-2">{h.description}</div>
      )}
      {h.result && isCompleted && (
        <div className="mt-0.5 text-green-400/80 text-[10px] italic">{h.result}</div>
      )}
    </div>
  )
}

const PLACEHOLDER_LOG: AgentHandover[] = [
  {
    from_agent: 'orchestrator', to_agent: 'sales', title: 'Initiate outbound sequence — wave 1',
    description: 'Target digital analytics decision-makers at Series A-C SaaS.',
    status: 'completed', created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 3600000).toISOString(), result: 'Sequence loaded in Apollo. 12 contacts enrolled.',
  },
  {
    from_agent: 'sales', to_agent: 'orchestrator', title: 'Discovery call booked — Inbound lead',
    description: 'Prospect from LinkedIn DM. Analytics maturity score: high.',
    status: 'completed', created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 4).toISOString(), result: 'Call scheduled for next week.',
  },
  {
    from_agent: 'orchestrator', to_agent: 'knowledge_steward', title: 'Update MEMORY.md with GTM partner search status',
    description: 'Reflect latest conversations and filtering criteria.',
    status: 'pending', created_at: new Date(Date.now() - 1800000).toISOString(),
    completed_at: null, result: null,
  },
]

export default function MissionLog() {
  const [handovers, setHandovers] = useState<AgentHandover[]>(PLACEHOLDER_LOG)

  useEffect(() => {
    async function fetchHandovers() {
      const { data, error } = await supabase
        .from('agent_handovers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data && data.length > 0) {
        setHandovers(data as AgentHandover[])
      }
    }

    fetchHandovers()

    const channel = supabase
      .channel('agent_handovers_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_handovers' }, () => {
        fetchHandovers()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div className="panel flex flex-col" style={{ minHeight: 0 }}>
      <div className="panel-header">◈ MISSION LOG — SHIP&apos;S RECORD</div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2" style={{ maxHeight: '280px' }}>
        {handovers.length === 0 ? (
          <div className="text-text-secondary text-[11px] text-center py-4">No transmissions logged.</div>
        ) : (
          handovers.map((h, i) => <LogEntry key={h.id ?? i} h={h} />)
        )}
      </div>
    </div>
  )
}
