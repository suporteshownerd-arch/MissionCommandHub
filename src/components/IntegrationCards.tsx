import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  MessageSquare, 
  Figma, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ExternalLink,
  RefreshCw,
  Zap
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  icon: React.ElementType
  status: 'ok' | 'pending' | 'error'
  lastCheck: string
  description: string
}

const sampleIntegrations: Integration[] = [
  { id: 'llm', name: 'LLM (OpenAI)', icon: MessageSquare, status: 'ok', lastCheck: '2 min atrás', description: 'GPT-4 para assistentes e dúvidas' },
  { id: 'notion', name: 'Notion', icon: Database, status: 'ok', lastCheck: '5 min atrás', description: 'Documentação e base de conhecimento' },
  { id: 'figma', name: 'Figma', icon: Figma, status: 'pending', lastCheck: '10 min atrás', description: 'Contexto de design para tarefas' },
  { id: 'slack', name: 'Slack', icon: Globe, status: 'ok', lastCheck: '1 min atrás', description: 'Notificações em tempo real' },
  { id: 'mcp', name: 'MCP Server', icon: Zap, status: 'ok', lastCheck: 'Agora', description: 'Protocolo Model Context Protocol' },
]

export default function IntegrationCards() {
  const [integrations] = useState(sampleIntegrations)
  const [validating, setValidating] = useState<string | null>(null)

  const handleValidate = (id: string) => {
    setValidating(id)
    setTimeout(() => setValidating(null), 2000)
  }

  const okCount = integrations.filter(i => i.status === 'ok').length
  const score = Math.round((okCount / integrations.length) * 100)

  return (
    <div className="h-full flex flex-col">
      {/* Stats Header */}
      <div className="grid grid-cols-4 gap-4 mb-6 stagger-children">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border-t-2 border-t-openclaw-primary"
        >
          <p className="text-3xl font-bold text-openclaw-primary">{score}%</p>
          <p className="text-sm text-openclaw-textMuted">Saúde Global</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 50 }}
          className="glass rounded-xl p-4 border-t-2 border-t-openclaw-success"
        >
          <p className="text-3xl font-bold text-openclaw-success">{okCount}</p>
          <p className="text-sm text-openclaw-textMuted">Integrações OK</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 100 }}
          className="glass rounded-xl p-4 border-t-2 border-t-openclaw-warning"
        >
          <p className="text-3xl font-bold text-openclaw-warning">{integrations.length - okCount}</p>
          <p className="text-sm text-openclaw-textMuted">Pendentes</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 150 }}
          className="glass rounded-xl p-4 flex items-center justify-between border-t-2 border-t-openclaw-accent"
        >
          <div>
            <p className="text-sm text-openclaw-textMuted">Última Validação</p>
            <p className="text-openclaw-text font-medium">Agora</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-openclaw-bgHover text-openclaw-textMuted hover:text-openclaw-primary transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Integration Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 50 + 200 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="glass rounded-xl p-4 border transition-all hover:border-openclaw-primary/40 hover:shadow-lg hover:shadow-openclaw-primary/5 cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-openclaw-bg group-hover:bg-openclaw-primary/10 transition-colors">
                    <integration.icon className="w-5 h-5 text-openclaw-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-openclaw-text group-hover:text-openclaw-primary transition-colors">{integration.name}</h3>
                    <p className="text-xs text-openclaw-textMuted">{integration.description}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {integration.status === 'ok' ? (
                    <CheckCircle className="w-4 h-4 text-openclaw-success" />
                  ) : integration.status === 'pending' ? (
                    <AlertCircle className="w-4 h-4 text-openclaw-warning" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-openclaw-error" />
                  )}
                  <span className={`text-sm font-medium ${
                    integration.status === 'ok' ? 'text-openclaw-success' :
                    integration.status === 'pending' ? 'text-openclaw-warning' :
                    'text-openclaw-error'
                  }`}>
                    {integration.status === 'ok' ? 'Conectado' : integration.status === 'pending' ? 'Pendente' : 'Erro'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-openclaw-textMuted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {integration.lastCheck}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleValidate(integration.id); }}
                    disabled={validating === integration.id}
                    className="p-1 rounded hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-primary transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${validating === integration.id ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 pt-3 border-t border-openclaw-border flex gap-2">
                <button className="flex-1 py-1.5 text-sm rounded-lg bg-openclaw-bg hover:bg-openclaw-primary/20 hover:text-openclaw-primary text-openclaw-textMuted transition-all flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Configurar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}