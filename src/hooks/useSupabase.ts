import { useState, useEffect, useCallback } from 'react'
import { supabase, Agent, Task, Activity, Integration } from '../lib/supabase'

// Hook para gerenciar dados do Supabase
export function useSupabase() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Testar conexão
  const testConnection = useCallback(async () => {
    try {
      setLoading(true)
      const { error } = await supabase.from('agents').select('count')
      if (error) throw error
      setConnected(true)
      setError(null)
    } catch (err: any) {
      console.error('Supabase connection error:', err)
      setConnected(false)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    testConnection()
  }, [testConnection])

  return { connected, loading, error, testConnection }
}

// Hook para agentes
export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setAgents(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  return { agents, loading, error, refetch: fetchAgents }
}

// Hook para tarefas
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true })
      
      if (error) throw error
      setTasks(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', taskId)
    
    if (!error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return { tasks, loading, error, refetch: fetchTasks, updateTaskStatus }
}

// Hook para atividades
export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50)
      
      if (error) throw error
      setActivities(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addActivity = useCallback(async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single()
    
    if (!error && data) {
      setActivities(prev => [data, ...prev])
    }
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return { activities, loading, error, refetch: fetchActivities, addActivity }
}

// Hook para integrações
export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      setIntegrations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const validateIntegration = useCallback(async (id: string) => {
    // Simular validação
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const { error } = await supabase
      .from('integrations')
      .update({ 
        status: 'ok', 
        last_check: new Date().toISOString() 
      })
      .eq('id', id)
    
    if (!error) {
      setIntegrations(prev => prev.map(i => 
        i.id === id ? { ...i, status: 'ok', last_check: new Date().toISOString() } : i
      ))
    }
  }, [])

  useEffect(() => {
    fetchIntegrations()
  }, [fetchIntegrations])

  return { integrations, loading, error, refetch: fetchIntegrations, validateIntegration }
}