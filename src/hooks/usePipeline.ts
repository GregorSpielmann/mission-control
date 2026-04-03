'use client'

import { useEffect, useState } from 'react'

export interface PipelineSnapshot {
  refreshed_at: string
  open_value: number
  open_count: number
  in_progress: number
  proposal_sent: number
  nurture: number
  won_count: number
  won_value: number
  deals: { name: string; stage: string; value: number | null }[]
}

export function usePipeline() {
  const [data, setData] = useState<PipelineSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pipeline')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
