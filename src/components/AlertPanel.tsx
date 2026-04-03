'use client'

import { useEffect, useState } from 'react'
import { supabase, AgentThread, AgentHandover } from '@/lib/supabase'

export default function AlertPanel() {
  const [blockedAgents, setBlockedAgents] = useState<AgentThread[]>([])
  const [pendingHandovers, setPendingHandovers] = useState<AgentHandover[]>([])

  useEffect(() => {
    async function fetchAlerts() {
      const [threadsRes, handoversRes] = await Promise.all([
        supabase
          .from('agent_threads')
          .select('name, status, blockers, current_mission, last_checkin')
          .eq('status', 'blocked'),
        supabase
          .from('agent_handovers')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(10),
      ])

      if (!threadsRes.error && threadsRes.data) {
        setBlockedAgents(threadsRes.data as AgentThread[])
      }
      if (!handoversRes.error && handoversRes.data) {
        setPendingHandovers(handoversRes.data as AgentHandover[])
      }
    }

    fetchAlerts()

    const ch1 = supabase
      .channel('alerts_threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_threads' }, fetchAlerts)
      .subscribe()

    const ch2 = supabase
      .channel('alerts_handovers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_handovers' }, fetchAlerts)
      .subscribe()

    return () => {
      supabase.removeChannel(ch1)
      supabase.removeChannel(ch2)
    }
  }, [])

  const hasAlerts = blockedAgents.length > 0 || pendingHandovers.length > 0

  return (
    <div className={`panel flex flex-col ${hasAlerts ? 'glow-red' : ''}`}>
      <div className="panel-header">
        ◈ ALERT PANEL
        {hasAlerts && (
          <span className="ml-2 text-red-400 pulse-red">
            [{blockedAgents.length + pendingHandovers.length} ACTIVE]
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {!hasAlerts && (
          <div className="flex items-center justify-center gap-2 py-4">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-green inline-block" />
            <span className="text-green-400 text-[11px]">ALL SYSTEMS NOMINAL</span>
          </div>
        )}

        {blockedAgents.map(agent => (
          <div key={agent.name} className="border border-red-500/40 rounded bg-red-950/20 px-3 py-2 glow-red">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 pulse-red inline-block flex-shrink-0" />
              <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">
                AGENT BLOCKED — {agent.name.replace('_', ' ')}
              </span>
            </div>
            {agent.blockers && (
              <div className="text-[10px] text-red-300/80">{agent.blockers}</div>
            )}
          </div>
        ))}

        {pendingHandovers.map((h, i) => (
          <div key={h.id ?? i} className="border border-amber-500/40 rounded bg-amber-950/20 px-3 py-2 glow-amber">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 pulse-amber inline-block flex-shrink-0" />
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                PENDING — {h.from_agent}
              </span>
            </div>
            <div className="text-[10px] text-amber-300/80">{h.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
