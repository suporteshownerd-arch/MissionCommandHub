// OpenClaw API Client
const API_BASE = (import.meta as any).env?.VITE_OPENCLAW_URL || 'http://localhost:3456'

export interface OpenClawStatus {
  connected: boolean
  uptime?: string
  version?: string
  memory?: number
}

export interface OpenClawAgent {
  id: string
  name: string
  status: 'idle' | 'running' | 'thinking' | 'error'
  icon: string
  color: string
  description?: string
  skills?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  agent?: string
}

class OpenClawAPI {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl
  }

  // Check connection status
  async checkConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      })
      return res.ok
    } catch {
      return false
    }
  }

  // Get system status
  async getStatus(): Promise<OpenClawStatus> {
    try {
      const res = await fetch(`${this.baseUrl}/api/status`)
      if (!res.ok) throw new Error('Failed to fetch status')
      return await res.json()
    } catch {
      // Fallback when not connected to real gateway
      return {
        connected: false,
        uptime: '--',
        version: '1.0.0',
        memory: 0
      }
    }
  }

  // Get all agents
  async getAgents(): Promise<OpenClawAgent[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/agents`)
      if (!res.ok) throw new Error('Failed to fetch agents')
      return await res.json()
    } catch {
      // Return mock agents when not connected
      return []
    }
  }

  // Execute agent
  async executeAgent(agentId: string, command: string): Promise<{ success: boolean; result?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })
      if (!res.ok) throw new Error('Failed to execute agent')
      return await res.json()
    } catch {
      return { success: false, result: 'Gateway não conectado' }
    }
  }

  // Send chat message
  async sendChatMessage(message: string, context?: Record<string, unknown>): Promise<{ response: string; agent?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      })
      if (!res.ok) throw new Error('Failed to send message')
      return await res.json()
    } catch {
      // Mock response when not connected
      const responses = [
        'Entendi sua mensagem! No momento estou operando em modo demo.',
        'Interessante! Quando conectado ao gateway, posso executar tarefas reais.',
        'Por enquanto sou um assistente demo. Configure o OpenClaw Gateway para ativar as funcionalidades completas.'
      ]
      return {
        response: responses[Math.floor(Math.random() * responses.length)],
        agent: 'demo'
      }
    }
  }
}

export const openclawApi = new OpenClawAPI()
export default openclawApi