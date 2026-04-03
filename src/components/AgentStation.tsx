'use client'

import { useEffect, useState } from 'react'
import { supabase, AgentThread } from '@/lib/supabase'

const AGENT_META: Record<string, { icon: string; role: string; color: string }> = {
  orchestrator:     { icon: '🎯', role: 'Strategic Ops',   color: 'blue'   },
  sales:            { icon: '🏹', role: 'Hunter',          color: 'green'  },
  knowledge_steward:{ icon: '🧠', role: 'Sage',            color: 'purple' },
  assistant:        { icon: '📡', role: 'Comms',           color: 'cyan'   },
  creative_partner: { icon: '🎨', role: 'Thinker',         color: 'amber'  },
  lead_dev:         { icon: '🔨', role: 'Engineer',        color: 'blue'   },
}

const DEFAULT_AGENTS: AgentThread[] = [
  { name: 'orchestrator',      status: 'idle',     current_mission: 'Awaiting orders', last_checkin: null, blockers: null },
  { name: 'sales',             status: 'idle',     current_mission: 'Monitoring pipeline', last_checkin: null, blockers: null },
  { name: 'knowledge_steward', status: 'idle',     current_mission: 'Indexing memory', last_checkin: null, blockers: null },
  { name: 'assistant',         status: 'idle',     current_mission: 'Standing by', last_checkin: null, blockers: null },
  { name: 'creative_partner',  status: 'idle',     current_mission: 'Idle', last_checkin: null, blockers: null },
  { name: 'lead_dev',          status: 'idle',     current_mission: 'Idle', last_checkin: null, blockers: null },
]

function formatRelativeTime(ts: string | null): string {
  if (!ts) return 'never'
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function StatusDot({ status }: { status: AgentThread['status'] }) {
  const map: Record<string, string> = {
    active:   'bg-green-400 pulse-green',
    idle:     'bg-amber-400 pulse-amber',
    blocked:  'bg-red-500 pulse-red',
    building: 'bg-blue-400 pulse-green',
  }
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${map[status] ?? 'bg-gray-600'}`}
    />
  )
}

function statusLabel(status: AgentThread['status']): string {
  return status.toUpperCase()
}

function statusTextColor(status: AgentThread['status']): string {
  return {
    active:   'text-green-400',
    idle:     'text-amber-400',
    blocked:  'text-red-400',
    building: 'text-blue-400',
  }[status] ?? 'text-gray-500'
}

function AgentCard({ agent }: { agent: AgentThread }) {
  const meta = AGENT_META[agent.name] ?? { icon: '?', role: 'Unknown', color: 'blue' }
  const glowClass = agent.status === 'blocked' ? 'glow-red' : agent.status === 'active' ? 'glow-green' : ''

  return (
    <div className={`panel p-3 flex flex-col gap-2 ${glowClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{meta.icon}</span>
          <div>
            <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
              {agent.name.replace('_', ' ')}
            </div>
            <div className="text-[10px] text-text-secondary">{meta.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={agent.status} />
          <span className={`text-[10px] font-bold ${statusTextColor(agent.status)}`}>
            {statusLabel(agent.status)}
          </span>
        </div>
      </div>

      <div className="text-[11px] text-text-secondary border-t border-border-dim pt-2">
        <span className="text-text-primary">{agent.current_mission ?? '—'}</span>
      </div>

      {agent.blockers && (
        <div className="text-[10px] text-red-400 bg-red-950/30 px-2 py-1 rounded">
          ⚠ {agent.blockers}
        </div>
      )}

      <div className="text-[10px] text-text-secondary">
        Last contact: <span className="text-text-accent">{formatRelativeTime(agent.last_checkin)}</span>
      </div>
    </div>
  )
}

export default function AgentStations() {
  const [agents, setAgents] = useState<AgentThread[]>(DEFAULT_AGENTS)

  useEffect(() => {
    async function fetchAgents() {
      const { data, error } = await supabase
        .from('agent_threads')
        .select('name, status, current_mission, last_checkin, blockers')

      if (!error && data && data.length > 0) {
        // Merge with defaults so all 6 agents always appear
        const merged = DEFAULT_AGENTS.map(def => {
          const live = data.find((d: AgentThread) => d.name === def.name)
          return live ?? def
        })
        setAgents(merged)
      }
    }

    fetchAgents()

    const channel = supabase
      .channel('agent_threads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_threads' }, () => {
        fetchAgents()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {agents.map(agent => (
        <AgentCard key={agent.name} agent={agent} />
      ))}
    </div>
  )
}
