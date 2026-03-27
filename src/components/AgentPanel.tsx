import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Plus, FolderOpen, ExternalLink, Search, FileText, Edit, Trash2, Play, Pause } from 'lucide-react'

// Sample agent data
const sampleAgents = [
  { id: '1', name: 'Research Agent', description: 'Pesquisas e análise de documentos', status: 'active', icon: '🔍' },
  { id: '2', name: 'Code Agent', description: 'Desenvolvimento e revisão de código', status: 'active', icon: '💻' },
  { id: '3', name: 'Writer Agent', description: 'Criação de conteúdo e documentação', status: 'idle', icon: '✍️' },
  { id: '4', name: 'Data Agent', description: 'Análise de dados e métricas', status: 'active', icon: '📊' },
]

export default function AgentPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const filteredAgents = sampleAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex gap-4">
      {/* Agent List */}
      <div className="w-80 flex flex-col glass rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-openclaw-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-openclaw-text flex items-center gap-2">
              <Bot className="w-5 h-5 text-openclaw-primary" />
              Agentes
            </h2>
            <button className="p-1.5 rounded-lg bg-openclaw-primary hover:bg-openclaw-primaryHover text-white transition-colors shadow-glow-primary hover:shadow-[0_0_25px_rgba(255,92,92,0.5)]">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-openclaw-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar agentes..."
              className="w-full bg-openclaw-bg border border-openclaw-border rounded-lg pl-9 py-2 text-sm text-openclaw-text placeholder-openclaw-textMuted focus:outline-none focus:border-openclaw-primary focus:ring-1 focus:ring-openclaw-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredAgents.map((agent, index) => (
            <motion.button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 50 }}
              className={`
                w-full text-left p-3 rounded-lg border transition-all
                ${selectedAgent === agent.id 
                  ? 'bg-openclaw-primary/15 border-openclaw-primary/50 shadow-glow-primary' 
                  : 'bg-openclaw-bgHover border-openclaw-border hover:border-openclaw-primary/30 hover:bg-openclaw-cardHover'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{agent.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-openclaw-text truncate">{agent.name}</h3>
                    <p className="text-sm text-openclaw-textMuted truncate">{agent.description}</p>
                  </div>
                </div>
                <span className={`
                  w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5
                  ${agent.status === 'active' ? 'bg-openclaw-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-openclaw-textMuted'}
                `} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Path Config */}
        <div className="p-3 border-t border-openclaw-border">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text transition-colors text-sm">
            <FolderOpen className="w-4 h-4" />
            <span className="truncate font-mono text-xs">.aiox-core/development/agents/</span>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </button>
        </div>
      </div>

      {/* Agent Detail / Empty State */}
      <div className="flex-1 glass rounded-xl overflow-hidden flex flex-col">
        {selectedAgent ? (
          <AgentDetail agentId={selectedAgent} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-openclaw-textMuted">
            <div className="w-20 h-20 rounded-2xl bg-openclaw-bg flex items-center justify-center mb-4 border border-openclaw-border">
              <Bot className="w-10 h-10 opacity-30" />
            </div>
            <p className="text-lg mb-2 text-openclaw-text">Selecione um agente</p>
            <p className="text-sm">Escolha um agente da lista para ver os detalhes</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AgentDetail({ agentId }: { agentId: string }) {
  const agent = sampleAgents.find(a => a.id === agentId)
  if (!agent) return null

  return (
    <>
      {/* Header */}
      <div className="p-5 border-b border-openclaw-border flex items-center justify-between bg-openclaw-bg/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-openclaw-primary/20 flex items-center justify-center shadow-glow-primary">
            <span className="text-3xl">{agent.icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-openclaw-text">{agent.name}</h2>
            <p className="text-sm text-openclaw-textMuted">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-openclaw-success/20 text-openclaw-success hover:bg-openclaw-success/30 transition-colors flex items-center gap-2 text-sm font-medium">
            <Play className="w-4 h-4" />
            Iniciar
          </button>
          <button className="p-2 rounded-lg hover:bg-openclaw-bgHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-openclaw-bgHover text-openclaw-textMuted hover:text-openclaw-error transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-openclaw-textMuted mb-3 uppercase tracking-wider">Status</h3>
          <div className="flex items-center gap-3 px-4 py-3 bg-openclaw-bg rounded-lg border border-openclaw-border">
            <span className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-openclaw-success shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-openclaw-textMuted'}`} />
            <span className="text-openclaw-text font-medium capitalize">{agent.status === 'active' ? 'Ativo' : 'Inativo'}</span>
            {agent.status === 'active' && (
              <span className="ml-auto badge badge-success">Executando</span>
            )}
          </div>
        </div>

        {/* File Path */}
        <div>
          <h3 className="text-sm font-medium text-openclaw-textMuted mb-3 uppercase tracking-wider">Arquivo</h3>
          <div className="flex items-center gap-3 px-4 py-3 bg-openclaw-bg rounded-lg border border-openclaw-border">
            <FileText className="w-5 h-5 text-openclaw-primary" />
            <code className="text-sm text-openclaw-text font-mono flex-1 truncate">.aiox-core/agents/{agent.name.toLowerCase().replace(/\s+/g, '-')}.md</code>
            <button className="p-1.5 rounded hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <h3 className="text-sm font-medium text-openclaw-textMuted mb-3 uppercase tracking-wider">Capacidades</h3>
          <div className="flex flex-wrap gap-2">
            {['Pesquisa', 'Análise', 'Automação', 'Integração'].map((cap) => (
              <span key={cap} className="px-3 py-1.5 rounded-lg bg-openclaw-bg border border-openclaw-border text-openclaw-textMuted text-sm hover:border-openclaw-primary/50 hover:text-openclaw-primary transition-colors cursor-pointer">
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-medium text-openclaw-textMuted mb-3 uppercase tracking-wider">Atividade Recente</h3>
          <div className="space-y-2">
            {[
              { action: 'Completou tarefa de pesquisa', time: '2 min atrás' },
              { action: 'Iniciou análise de documentos', time: '15 min atrás' },
              { action: 'Atualizou base de conhecimento', time: '1h atrás' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-openclaw-bg rounded-lg border border-openclaw-border">
                <div className="w-1.5 h-1.5 rounded-full bg-openclaw-primary" />
                <span className="text-sm text-openclaw-text flex-1">{activity.action}</span>
                <span className="text-xs text-openclaw-textMuted">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}