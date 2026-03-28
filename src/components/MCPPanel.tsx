import { useState, useEffect, useRef } from 'react'
import {
  Bot,
  Play,
  Square,
  Terminal,
  Wrench,
  Search,
  FileCode,
  MessageSquare,
  Database,
  Clock,
  Zap,
  ChevronRight,
  Send
} from 'lucide-react'
import { useMCP, mcpTools, commandSuggestions } from '../lib/mcp'

const categoryIcons: Record<string, React.ElementType> = {
  search: Search,
  code: FileCode,
  data: Database,
  communication: MessageSquare,
  automation: Clock,
}

const categoryColors: Record<string, string> = {
  search: 'text-openclaw-primary',
  code: 'text-openclaw-accent',
  data: 'text-openclaw-warning',
  communication: 'text-purple-400',
  automation: 'text-openclaw-success',
}

export default function MCPPanel() {
  const { agents, logs, executeAgent, stopAgent, useTool, addLog } = useMCP()
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [command, setCommand] = useState('')
  const [activeTab, setActiveTab] = useState<'agents' | 'tools' | 'console'>('agents')
  const logsEndRef = useRef<HTMLDivElement>(null)

  const selectedAgentData = agents.find(a => a.id === selectedAgent)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const handleExecute = async () => {
    if (!command.trim()) return
    if (selectedAgent) await executeAgent(selectedAgent, command)
    else addLog(`⚠️ Selecione um agente primeiro`)
    setCommand('')
  }

  const handleToolUse = async (toolId: string) => {
    if (!selectedAgent) {
      addLog(`⚠️ Selecione um agente para usar ferramentas`)
      return
    }
    await useTool(toolId, { agentId: selectedAgent })
  }

  return (
    <div className="h-full flex gap-4">
      <div className="w-96 flex flex-col gap-4">
        <div className="flex gap-2">
          {(['agents', 'tools', 'console'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-openclaw-primary text-white shadow-glow-primary' : 'text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text'}`}>
              {tab === 'agents' ? '🤖 Agentes' : tab === 'tools' ? '🔧 Ferramentas' : '📟 Console'}
            </button>
          ))}
        </div>

        <div className="flex-1 glass rounded-xl overflow-hidden">
          {activeTab === 'agents' && (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-openclaw-border"><h3 className="font-medium text-openclaw-text flex items-center gap-2"><Bot className="w-4 h-4 text-openclaw-primary" />Agentes MCP</h3></div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {agents.map((agent) => (
                  <button key={agent.id} onClick={() => setSelectedAgent(agent.id)} className={`w-full p-3 rounded-lg border transition-all text-left ${selectedAgent === agent.id ? 'bg-openclaw-primary/15 border-openclaw-primary/50 shadow-glow-primary' : 'bg-openclaw-bgHover border-openclaw-border hover:border-openclaw-primary/30'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${agent.color}20` }}>{agent.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-openclaw-text">{agent.name}</span>
                          <span className={`w-2 h-2 rounded-full ${agent.status === 'running' ? 'bg-openclaw-success animate-pulse' : agent.status === 'thinking' ? 'bg-openclaw-warning animate-pulse' : agent.status === 'error' ? 'bg-openclaw-error' : 'bg-openclaw-textMuted'}`} />
                        </div>
                        <span className="text-xs text-openclaw-textMuted capitalize">{agent.type}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-openclaw-textMuted" />
                    </div>
                    {agent.currentTask && <div className="mt-2 text-xs text-openclaw-primary truncate">→ {agent.currentTask}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-openclaw-border"><h3 className="font-medium text-openclaw-text flex items-center gap-2"><Wrench className="w-4 h-4 text-openclaw-accent" />Ferramentas MCP</h3></div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {mcpTools.map((tool) => {
                  const Icon = categoryIcons[tool.category] || Wrench
                  const colorClass = categoryColors[tool.category] || 'text-openclaw-textMuted'
                  return (
                    <button key={tool.id} onClick={() => handleToolUse(tool.id)} className="w-full p-2.5 rounded-lg border border-openclaw-border hover:border-openclaw-primary/30 hover:bg-openclaw-bgHover transition-all text-left flex items-center gap-3 group">
                      <div className={`p-2 rounded-lg bg-openclaw-bg ${colorClass}`}><Icon className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><span className="text-sm font-medium text-openclaw-text">{tool.name}</span><span className="text-xs px-1.5 py-0.5 rounded bg-openclaw-bg text-openclaw-textMuted capitalize">{tool.category}</span></div>
                        <span className="text-xs text-openclaw-textMuted">{tool.description}</span>
                      </div>
                      <Zap className="w-4 h-4 text-openclaw-textMuted group-hover:text-openclaw-primary transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'console' && (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-openclaw-border flex items-center justify-between">
                <h3 className="font-medium text-openclaw-text flex items-center gap-2"><Terminal className="w-4 h-4 text-openclaw-warning" />Console de Comandos</h3>
                <button onClick={() => addLog('🗑️ Console limpo')} className="text-xs text-openclaw-textMuted hover:text-openclaw-text">Limpar</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
                {logs.length === 0 ? <p className="text-openclaw-textMuted text-center py-4">Nenhuma atividade ainda...</p> : logs.map((log, i) => <div key={i} className="text-openclaw-textMuted hover:text-openclaw-text">{log}</div>)}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {selectedAgentData && (
          <div className="glass rounded-xl p-4 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${selectedAgentData.color}20` }}>{selectedAgentData.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-openclaw-text">{selectedAgentData.name}</h3>
                  <p className="text-sm text-openclaw-textMuted">{selectedAgentData.status === 'idle' ? 'Aguardando comando' : selectedAgentData.status === 'thinking' ? 'Pensando...' : selectedAgentData.status === 'running' ? `Executando: ${selectedAgentData.currentTask}` : 'Erro'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedAgentData.status === 'running' ? (
                  <button onClick={() => stopAgent(selectedAgentData.id)} className="px-4 py-2 rounded-lg bg-openclaw-error/20 text-openclaw-error hover:bg-openclaw-error/30 transition-colors flex items-center gap-2"><Square className="w-4 h-4" />Parar</button>
                ) : (
                  <button onClick={() => executeAgent(selectedAgentData.id, 'Iniciar')} className="px-4 py-2 rounded-lg bg-openclaw-success/20 text-openclaw-success hover:bg-openclaw-success/30 transition-colors flex items-center gap-2"><Play className="w-4 h-4" />Iniciar</button>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-openclaw-border">
              <p className="text-xs text-openclaw-textMuted mb-2">Ferramentas disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {selectedAgentData.tools.map((toolId) => {
                  const tool = mcpTools.find(t => t.id === toolId)
                  return tool ? <span key={tool.id} className="px-2 py-1 rounded bg-openclaw-bg border border-openclaw-border text-xs text-openclaw-textMuted">{tool.icon} {tool.name}</span> : null
                })}
              </div>
            </div>
          </div>
        )}

        <div className="glass rounded-xl p-4 border flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3"><Terminal className="w-4 h-4 text-openclaw-warning" /><span className="text-sm font-medium text-openclaw-text">Digite um comando</span></div>
          <div className="mb-3 flex flex-wrap gap-2">
            {commandSuggestions.slice(0, 6).map((suggestion) => (
              <button key={suggestion.command} onClick={() => setCommand(suggestion.example)} className="text-xs px-2 py-1 rounded bg-openclaw-bg border border-openclaw-border text-openclaw-textMuted hover:border-openclaw-primary/50 hover:text-openclaw-primary transition-colors">{suggestion.command}</button>
            ))}
          </div>
          <div className="flex-1 flex flex-col">
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleExecute()
                }
              }}
              placeholder={selectedAgent ? 'Digite o comando para o agente...' : 'Selecione um agente primeiro...'}
              disabled={!selectedAgent}
              className="flex-1 bg-openclaw-bg border border-openclaw-border rounded-lg p-3 text-openclaw-text placeholder-openclaw-textMuted font-mono text-sm resize-none focus:outline-none focus:border-openclaw-primary focus:ring-1 focus:ring-openclaw-primary/30 disabled:opacity-50"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-openclaw-textMuted">Enter para executar • Shift+Enter para nova linha</span>
              <button onClick={handleExecute} disabled={!selectedAgent || !command.trim()} className="px-4 py-2 rounded-lg bg-openclaw-primary hover:bg-openclaw-primaryHover text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-primary"><Send className="w-4 h-4" />Executar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}