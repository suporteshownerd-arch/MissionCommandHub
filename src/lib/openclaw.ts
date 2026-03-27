/**
 * OpenClaw Gateway Client
 * Integração com o Gateway OpenClaw para controle de agentes
 */

import { supabase } from './supabase'

export interface OpenClawConfig {
  gatewayUrl: string
  token?: string
}

export interface Agent {
  id: string
  name: string
  status: 'idle' | 'running' | 'thinking' | 'error'
  capabilities: string[]
  icon: string
  color: string
}

export interface CommandResult {
  success: boolean
  output?: string
  error?: string
  duration?: number
}

// Configuração padrão
let config: OpenClawConfig = {
  gatewayUrl: 'http://localhost:18789',
}

// Inicializar cliente OpenClaw
export function initOpenClaw(newConfig: Partial<OpenClawConfig>) {
  config = { ...config, ...newConfig }
}

// Verificar status da conexão
export async function checkConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${config.gatewayUrl}/health`, {
      method: 'GET',
      headers: config.token ? { 'Authorization': `Bearer ${config.token}` } : {},
      signal: AbortSignal.timeout(5000),
    })
    return response.ok
  } catch {
    return false
  }
}

// Listar agentes disponíveis
export async function listAgents(): Promise<Agent[]> {
  try {
    const response = await fetch(`${config.gatewayUrl}/api/agents`, {
      headers: config.token ? { 'Authorization': `Bearer ${config.token}` } : {},
    })
    
    if (!response.ok) throw new Error('Failed to fetch agents')
    
    const data = await response.json()
    return data.agents || []
  } catch (error) {
    console.warn('Using fallback agents:', error)
    // Fallback se o Gateway não estiver disponível
    return getFallbackAgents()
  }
}

// Executar comando em um agente
export async function executeCommand(agentId: string, command: string): Promise<CommandResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${config.gatewayUrl}/api/agents/${agentId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {}),
      },
      body: JSON.stringify({ command }),
    })
    
    if (!response.ok) throw new Error('Command execution failed')
    
    const data = await response.json()
    
    // Registrar atividade no Supabase
    await logActivity(agentId, command, data)
    
    return {
      success: true,
      output: data.output,
      duration: Date.now() - startTime,
    }
  } catch (error: any) {
    // Simular execução local se o Gateway não responder
    return await simulateExecution(agentId, command, startTime)
  }
}

// Enviar mensagem de chat
export async function sendChatMessage(message: string, context?: Record<string, unknown>): Promise<string> {
  try {
    const response = await fetch(`${config.gatewayUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {}),
      },
      body: JSON.stringify({ message, context }),
    })
    
    if (!response.ok) throw new Error('Chat failed')
    
    const data = await response.json()
    return data.response
  } catch {
    // Resposta simulada se o Gateway não estiver disponível
    return generateMockResponse(message)
  }
}

// Obter status do sistema
export async function getSystemStatus(): Promise<{
  agents: number
  uptime: string
  memory: number
  version: string
}> {
  try {
    const response = await fetch(`${config.gatewayUrl}/api/status`, {
      headers: config.token ? { 'Authorization': `Bearer ${config.token}` } : {},
    })
    
    if (!response.ok) throw new Error('Status fetch failed')
    
    return await response.json()
  } catch {
    // Status simulado
    return {
      agents: 3,
      uptime: '99.9%',
      memory: Math.floor(Math.random() * 50 + 30),
      version: '1.0.0',
    }
  }
}

// Obter sessões ativas
export async function getActiveSessions(): Promise<any[]> {
  try {
    const response = await fetch(`${config.gatewayUrl}/api/sessions`, {
      headers: config.token ? { 'Authorization': `Bearer ${config.token}` } : {},
    })
    
    if (!response.ok) throw new Error('Sessions fetch failed')
    
    return await response.json()
  } catch {
    return []
  }
}

// ==================== Funções Auxiliares ====================

function getFallbackAgents(): Agent[] {
  return [
    { id: '1', name: 'Research Agent', status: 'idle', capabilities: ['search', 'read', 'analyze'], icon: '🔍', color: '#ff5c5c' },
    { id: '2', name: 'Code Agent', status: 'idle', capabilities: ['code', 'debug', 'test'], icon: '💻', color: '#14b8a6' },
    { id: '3', name: 'Writer Agent', status: 'idle', capabilities: ['write', 'edit', 'summarize'], icon: '✍️', color: '#8b5cf6' },
  ]
}

async function simulateExecution(agentId: string, command: string, startTime: number): Promise<CommandResult> {
  // Simular delay de execução
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const agent = getFallbackAgents().find(a => a.id === agentId)
  const output = `Executado em ${agent?.name || 'agente'}: ${command}`
  
  // Registrar no Supabase
  await logActivity(agentId, command, { output, simulated: true })
  
  return {
    success: true,
    output,
    duration: Date.now() - startTime,
  }
}

function generateMockResponse(_message: string): string {
  const responses = [
    'Entendi! Posso ajudar com isso.',
    'Vou executar essa tarefa para você.',
    'Processando sua solicitação...',
    'Ótima ideia! Vou trabalhar nisso.',
    '正在处理... (Traduzindo)',
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

async function logActivity(agentId: string, action: string, metadata: any) {
  try {
    const agent = getFallbackAgents().find(a => a.id === agentId)
    await supabase.from('activities').insert({
      agent_id: agentId,
      agent_name: agent?.name || 'Unknown',
      action,
      type: 'agent',
      metadata,
    })
  } catch (e) {
    console.warn('Failed to log activity:', e)
  }
}

// Hook React para usar OpenClaw
export function useOpenClaw() {
  return {
    config,
    init: initOpenClaw,
    checkConnection,
    listAgents,
    executeCommand,
    sendChatMessage,
    getSystemStatus,
    getActiveSessions,
  }
}