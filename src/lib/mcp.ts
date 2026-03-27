import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// MCP Tools definitions
export interface MCPTool {
  id: string
  name: string
  description: string
  category: 'search' | 'code' | 'data' | 'communication' | 'automation'
  icon: string
  status: 'available' | 'running' | 'error'
  lastUsed?: string
}

export interface MCPAgent {
  id: string
  name: string
  type: 'research' | 'code' | 'writer' | 'data' | 'general'
  status: 'idle' | 'thinking' | 'running' | 'error'
  tools: string[]
  currentTask?: string
  icon: string
  color: string
}

// MCP Tools disponíveis
export const mcpTools: MCPTool[] = [
  { id: '1', name: 'Web Search', description: 'Buscar informações na internet', category: 'search', icon: '🔍', status: 'available' },
  { id: '2', name: 'Read Files', description: 'Ler arquivos do sistema', category: 'data', icon: '📁', status: 'available' },
  { id: '3', name: 'Execute Code', description: 'Executar código Python/JS', category: 'code', icon: '💻', status: 'available' },
  { id: '4', name: 'Write Files', description: 'Criar/editar arquivos', category: 'data', icon: '✏️', status: 'available' },
  { id: '5', name: 'Git Operations', description: 'Git add, commit, push, etc', category: 'code', icon: '📦', status: 'available' },
  { id: '6', name: 'Send Email', description: 'Enviar emails via SMTP', category: 'communication', icon: '📧', status: 'available' },
  { id: '7', name: 'Slack Notify', description: 'Enviar mensagens para Slack', category: 'communication', icon: '💬', status: 'available' },
  { id: '8', name: 'Database Query', description: 'Consultar banco de dados', category: 'data', icon: '🗄️', status: 'available' },
  { id: '9', name: 'API Request', description: 'Fazer chamadas HTTP', category: 'communication', icon: '🌐', status: 'available' },
  { id: '10', name: 'Schedule Task', description: 'Agendar tarefas Cron', category: 'automation', icon: '⏰', status: 'available' },
]

// Agentes MCP
export const mcpAgents: MCPAgent[] = [
  { id: '1', name: 'Research Agent', type: 'research', status: 'idle', tools: ['1', '2', '4'], icon: '🔍', color: '#ff5c5c' },
  { id: '2', name: 'Code Agent', type: 'code', status: 'idle', tools: ['3', '4', '5'], icon: '💻', color: '#14b8a6' },
  { id: '3', name: 'Writer Agent', type: 'writer', status: 'idle', tools: ['2', '4', '6'], icon: '✍️', color: '#8b5cf6' },
  { id: '4', name: 'Data Agent', type: 'data', status: 'idle', tools: ['8', '9', '10'], icon: '📊', color: '#f59e0b' },
  { id: '5', name: 'General Assistant', type: 'general', status: 'idle', tools: ['1', '2', '3', '4', '6', '7'], icon: '🤖', color: '#6366f1' },
]

// Hook para gerenciar MCP
export function useMCP() {
  const [agents, setAgents] = useState<MCPAgent[]>(mcpAgents)
  const [tools] = useState<MCPTool[]>(mcpTools)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  // Executar comando em agente
  const executeAgent = useCallback(async (agentId: string, command: string) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return

    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: 'thinking', currentTask: command } : a
    ))

    addLog(`🤖 ${agent.name}: Executando "${command}"...`)

    // Simular execução
    await new Promise(resolve => setTimeout(resolve, 2000))

    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: 'running', currentTask: command } : a
    ))

    addLog(`✅ ${agent.name}: Concluído!`)

    // Registrar no Supabase
    await supabase.from('activities').insert({
      agent_id: agentId,
      agent_name: agent.name,
      action: `Executou: ${command}`,
      type: 'agent',
      metadata: { command }
    })

    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: 'idle', currentTask: undefined } : a
    ))
  }, [agents])

  // Parar agente
  const stopAgent = useCallback(async (agentId: string) => {
    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: 'idle', currentTask: undefined } : a
    ))
    
    const agent = agents.find(a => a.id === agentId)
    if (agent) {
      addLog(`⏹️ ${agent.name}: Parado`)
    }
  }, [agents])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR')
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)])
  }

  // Tool usage
  const useTool = useCallback(async (toolId: string, params?: any) => {
    const tool = tools.find(t => t.id === toolId)
    if (!tool) return { success: false, error: 'Tool not found' }

    addLog(`🔧 Usando ${tool.name}...`)

    // Simular uso da ferramenta
    await new Promise(resolve => setTimeout(resolve, 1000))

    await supabase.from('activities').insert({
      action: `Usou ferramenta: ${tool.name}`,
      type: 'system',
      metadata: { tool: tool.name, params }
    })

    addLog(`✅ ${tool.name} executado com sucesso`)

    return { success: true, result: 'Concluído' }
  }, [tools])

  return {
    agents,
    tools,
    selectedAgent,
    setSelectedAgent,
    logs,
    running,
    executeAgent,
    stopAgent,
    useTool,
    addLog
  }
}

// Command suggestions para autocomplete
export const commandSuggestions = [
  { command: 'search', description: 'Buscar informações', example: 'search "React hooks tutorial"' },
  { command: 'read', description: 'Ler arquivo', example: 'read /src/App.tsx' },
  { command: 'write', description: 'Criar arquivo', example: 'write /src/new.tsx --content "..."' },
  { command: 'execute', description: 'Executar código', example: 'execute python --code "print(1+1)"' },
  { command: 'git', description: 'Operações Git', example: 'git commit -m "fix: bug"' },
  { command: 'send', description: 'Enviar mensagem', example: 'send slack --channel "#dev" --message "Deploy done!"' },
  { command: 'query', description: 'Consultar banco', example: 'query SELECT * FROM users' },
  { command: 'schedule', description: 'Agendar tarefa', example: 'schedule "0 9 * * *" --task "backup"' },
]