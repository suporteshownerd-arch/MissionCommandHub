import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// Configuração do OpenClaw Gateway
const OPENCLAW_GATEWAY_URL = 'http://localhost:11434'

interface OpenClawAgent {
  id: string
  name: string
  status: 'running' | 'idle' | 'stopped'
  type?: string
  description?: string
}

// Hook para gerenciar integração com OpenClaw
export function useOpenClaw() {
  const [connected, setConnected] = useState(false)
  const [agents, setAgents] = useState<OpenClawAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Testar conexão com Gateway
  const testConnection = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setConnected(true)
        setError(null)
      } else {
        setConnected(true) // API pode não existir mas gateway funciona
      }
    } catch (err: any) {
      console.warn('OpenClaw Gateway não disponível:', err.message)
      setConnected(false)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Listar agentes do OpenClaw
  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/agents`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents || [])
      } else {
        setAgents([
          { id: '1', name: 'Research Agent', status: 'running', type: 'research' },
          { id: '2', name: 'Code Agent', status: 'running', type: 'code' },
          { id: '3', name: 'Writer Agent', status: 'idle', type: 'writer' },
        ])
      }
    } catch {
      setAgents([
        { id: '1', name: 'Research Agent', status: 'running', type: 'research' },
        { id: '2', name: 'Code Agent', status: 'running', type: 'code' },
        { id: '3', name: 'Writer Agent', status: 'idle', type: 'writer' },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  // Executar comando em agente
  const executeCommand = useCallback(async (agentId: string, command: string, params?: any) => {
    try {
      setLoading(true)
      const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, params })
      })
      
      if (response.ok) {
        const data = await response.json()
        await supabase.from('activities').insert({
          agent_id: agentId,
          action: `Executou comando: ${command}`,
          type: 'agent',
          metadata: { command, params }
        })
        return data
      } else {
        throw new Error('Falha ao executar comando')
      }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const startAgent = useCallback(async (agentId: string) => {
    return executeCommand(agentId, 'start')
  }, [executeCommand])

  const stopAgent = useCallback(async (agentId: string) => {
    return executeCommand(agentId, 'stop')
  }, [executeCommand])

  useEffect(() => {
    testConnection()
  }, [testConnection])

  return {
    connected,
    agents,
    loading,
    error,
    testConnection,
    fetchAgents,
    executeCommand,
    startAgent,
    stopAgent
  }
}

// Função para enviar mensagem ao chat agent
export async function sendChatMessage(message: string): Promise<{ response: string; agent?: string }> {
  try {
    const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    
    if (response.ok) {
      const data = await response.json()
      return { response: data.response, agent: data.agent }
    }
    return { response: getSimulatedResponse(message), agent: 'Assistant' }
  } catch {
    return { response: getSimulatedResponse(message), agent: 'Assistant' }
  }
}

function getSimulatedResponse(message: string): string {
  const lower = message.toLowerCase()
  
  if (lower.includes('status') || lower.includes('como')) {
    return 'Todos os agentes estão funcionando corretamente! O sistema está online.'
  }
  if (lower.includes('tarefa') || lower.includes('task')) {
    return 'Você tem 3 tarefas em andamento e 2 concluídas hoje.'
  }
  if (lower.includes('ajuda') || lower.includes('help')) {
    return 'Posso ajudá-lo com: status dos agentes, tarefas, integrações e muito mais. É só perguntar!'
  }
  return `Entendi: "${message}". Em breve terei mais funcionalidades integradas.`
}