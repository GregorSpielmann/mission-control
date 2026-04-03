import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AgentThread = {
  id?: string
  name: string
  status: 'active' | 'idle' | 'blocked' | 'building'
  current_mission: string | null
  last_checkin: string | null
  blockers: string | null
}

export type AgentHandover = {
  id?: string
  from_agent: string
  to_agent: string
  title: string
  description: string | null
  status: 'pending' | 'acknowledged' | 'completed'
  created_at: string
  completed_at: string | null
  result: string | null
}
