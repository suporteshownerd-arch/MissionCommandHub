import { createClient } from '@supabase/supabase-js'

// Criar cliente Supabase - usando a chave correta
export const supabase = createClient(
  'https://sb-publishable-i-7uiojc0ratsj5qqsvmjg-jmff-okp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYGnP3M',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
)

// Tipos TypeScript para as tabelas
export interface Agent {
  id: string
  name: string
  description: string
  status: 'active' | 'idle' | 'error'
  icon: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  agent_id: string | null
  title: string
  description: string | null
  status: 'backlog' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  position: number
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  agent_id: string | null
  agent_name: string | null
  action: string
  type: 'agent' | 'task' | 'system' | 'integration'
  metadata: Record<string, unknown>
  timestamp: string
}

export interface Integration {
  id: string
  name: string
  type: string
  status: 'ok' | 'pending' | 'error'
  config: Record<string, string>
  last_check: string
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}