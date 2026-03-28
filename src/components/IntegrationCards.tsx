import { useState, useEffect } from 'react'
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
  Zap,
  Loader
} from 'lucide-react'
import { supabase, Integration } from '../lib/supabase'

const fallbackIntegrations: Integration[] = [
  { id: '1', name: 'LLM (OpenAI)', type: 'llm', status: 'ok', config: {}, last_check: '2 min atrás', created_at: '' },
  { id: '2', name: 'Notion', type: 'database', status: 'ok', config: {}, last_check: '5 min atrás', created_at: '' },
  { id: '3', name: 'Figma', type: 'design', status: 'pending', config: {}, last_check: '10 min atrás', created_at: '' },
  { id: '4', name: 'Slack', type: 'messaging', status: 'ok', config: {}, last_check: '1 min atrás', created_at: '' },
  { id: '5', name: 'MCP Server', type: 'protocol', status: 'ok', config: {}, last_check: 'Agora', created_at: '' },
]

const iconMap: Record<string, React.ElementType> = {
  llm: MessageSquare,
  database: Database,
  messaging: Globe,
  protocol: Zap,
  design: Figma,
}

export default function IntegrationCards() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [validating, setValidating] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      
      if (data && data.length > 0) {
        setIntegrations(data)
      } else {
        setIntegrations(fallbackIntegrations)
      }
    } catch (err) {
      console.warn('Using fallback integrations')
      setIntegrations(fallbackIntegrations)
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async (id: string) => {
    setValidating(id)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      await supabase
        .from('integrations')
        .update({ status: 'ok', last_check: new Date().toISOString() })
        .eq('id', id)
      
      setIntegrations(prev => prev.map(i => 
        i.id === id ? { ...i, status: 'ok', last_check: new Date().toISOString() } : i
      ))
    } finally {
      setValidating(null)
    }
  }

  const okCount = integrations.filter(i => i.status === 'ok').length
  const score = integrations.length > 0 ? Math.round((okCount / integrations.length) * 100) : 0

  const formatLastCheck = (date: string) => {
    if (!date) return 'Nunca'
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000)
    if (diff < 1) return 'Agora'
    if (diff < 60) return `${diff} min atrás`
    return d.toLocaleTimeString('pt-BR')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-openclaw-primary" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-xl p-4 border-t-2 border-t-openclaw-primary">
          <p className="text-3xl font-bold text-openclaw-primary">{score}%</p>
          <p className="text-sm text-openclaw-textMuted">Saúde Global</p>
        </div>
        <div className="glass rounded-xl p-4 border-t-2 border-t-openclaw-success">
          <p className="text-3xl font-bold text-openclaw-success">{okCount}</p>
          <p className="text-sm text-openclaw-textMuted">Integrações OK</p>
        </div>
        <div className="glass rounded-xl p-4 border-t-2 border-t-openclaw-warning">
          <p className="text-3xl font-bold text-openclaw-warning">{integrations.length - okCount}</p>
          <p className="text-sm text-openclaw-textMuted">Pendentes</p>
        </div>
        <div className="glass rounded-xl p-4 flex items-center justify-between border-t-2 border-t-openclaw-accent">
          <div>
            <p className="text-sm text-openclaw-textMuted">Última Validação</p>
            <p className="text-openclaw-text font-medium">Agora</p>
          </div>
          <button onClick={fetchIntegrations} className="p-2 rounded-lg hover:bg-openclaw-bgHover text-openclaw-textMuted hover:text-openclaw-primary transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const IconComponent = iconMap[integration.type] || Globe
            return (
              <div
                key={integration.id}
                className="glass rounded-xl p-4 border transition-all hover:border-openclaw-primary/40 hover:shadow-lg hover:shadow-openclaw-primary/5 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-openclaw-bg group-hover:bg-openclaw-primary/10 transition-colors">
                      <IconComponent className="w-5 h-5 text-openclaw-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-openclaw-text group-hover:text-openclaw-primary transition-colors">{integration.name}</h3>
                      <p className="text-xs text-openclaw-textMuted">{integration.type}</p>
                    </div>
                  </div>
                </div>

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
                      {formatLastCheck(integration.last_check)}
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

                <div className="mt-3 pt-3 border-t border-openclaw-border flex gap-2">
                  <button className="flex-1 py-1.5 text-sm rounded-lg bg-openclaw-bg hover:bg-openclaw-primary/20 hover:text-openclaw-primary text-openclaw-textMuted transition-all flex items-center justify-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Configurar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}