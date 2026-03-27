import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Activity,
  Cpu,
  Zap,
  Terminal,
  Settings,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader,
  Play,
  Square
} from 'lucide-react'
import { useMCP } from '../lib/mcp'
import { checkConnection, getSystemStatus, listAgents } from '../lib/openclaw'

interface StatCard {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bgColor: string
}

interface Agent {
  id: string
  name: string
  status: 'idle' | 'running' | 'thinking' | 'error'
  icon: string
  color: string
}

export default function Dashboard() {
  const { agents: mcpAgentsState, executeAgent, stopAgent } = useMCP()
  const [openClawConnected, setOpenClawConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [openClawAgents, setOpenClawAgents] = useState<Agent[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    
    // Check OpenClaw connection
    const connected = await checkConnection()
    setOpenClawConnected(connected)
    
    // Get system status
    const status = await getSystemStatus()
    setSystemStatus(status)
    
    // Get agents
    const agents = await listAgents()
    setOpenClawAgents(agents)
    
    setLoading(false)
  }

  const stats: StatCard[] = [
    { label: 'Agentes Ativos', value: mcpAgentsState.filter(a => a.status !== 'idle').length, icon: Bot, color: 'text-openclaw-primary', bgColor: 'bg-openclaw-primary/10' },
    { label: 'Agentes MCP', value: mcpAgentsState.length, icon: Cpu, color: 'text-openclaw-accent', bgColor: 'bg-openclaw-accent/10' },
    { label: 'Gateway', value: openClawConnected ? 'Online' : 'Offline', icon: openClawConnected ? Wifi : WifiOff, color: openClawConnected ? 'text-openclaw-success' : 'text-openclaw-error', bgColor: openClawConnected ? 'bg-openclaw-success/10' : 'bg-openclaw-error/10' },
    { label: 'Uptime', value: systemStatus?.uptime || '--', icon: Activity, color: 'text-openclaw-warning', bgColor: 'bg-openclaw-warning/10' },
  ]

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-openclaw-primary" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto space-y-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-openclaw-text flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            Mission Command Hub
          </h1>
          <p className="text-openclaw-textMuted mt-1">Controle centralizado de agentes de IA</p>
        </div>
        <button 
          onClick={loadDashboardData}
          className="p-2 rounded-lg bg-openclaw-card border border-openclaw-border text-openclaw-textMuted hover:text-openclaw-primary hover:border-openclaw-primary/50 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 50 }}
            className="glass rounded-xl p-4 border-t-2"
            style={{ borderColor: stat.color.replace('text-', '').replace('/10', '') }}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className={`text-xs px-2 py-0.5 rounded ${stat.bgColor} ${stat.color}`}>
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-openclaw-text">{stat.value}</p>
            <p className="text-xs text-openclaw-textMuted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MCP Agents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 200 }}
          className="glass rounded-xl overflow-hidden border"
        >
          <div className="p-4 border-b border-openclaw-border flex items-center justify-between">
            <h3 className="font-semibold text-openclaw-text flex items-center gap-2">
              <Bot className="w-5 h-5 text-openclaw-primary" />
              Agentes MCP
            </h3>
            <span className="text-xs text-openclaw-textMuted">{mcpAgentsState.length} agentes</span>
          </div>
          <div className="p-2 space-y-2">
            {mcpAgentsState.map((agent) => (
              <div 
                key={agent.id}
                className="flex items-center justify-between p-3 rounded-lg bg-openclaw-bgHover hover:bg-openclaw-cardHover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${agent.color}20` }}
                  >
                    {agent.icon}
                  </div>
                  <div>
                    <p className="font-medium text-openclaw-text text-sm">{agent.name}</p>
                    <p className="text-xs text-openclaw-textMuted capitalize">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'running' ? 'bg-openclaw-success animate-pulse' :
                    agent.status === 'thinking' ? 'bg-openclaw-warning animate-pulse' :
                    agent.status === 'error' ? 'bg-openclaw-error' :
                    'bg-openclaw-textMuted'
                  }`} />
                  <button 
                    onClick={() => agent.status === 'running' ? stopAgent(agent.id) : executeAgent(agent.id, 'Iniciar')}
                    className="p-1.5 rounded hover:bg-openclaw-card text-openclaw-textMuted hover:text-openclaw-text transition-colors"
                  >
                    {agent.status === 'running' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* OpenClaw Agents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 300 }}
          className="glass rounded-xl overflow-hidden border"
        >
          <div className="p-4 border-b border-openclaw-border flex items-center justify-between">
            <h3 className="font-semibold text-openclaw-text flex items-center gap-2">
              <Zap className="w-5 h-5 text-openclaw-accent" />
              Agentes OpenClaw
            </h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${openClawConnected ? 'bg-openclaw-success animate-pulse' : 'bg-openclaw-error'}`} />
              <span className="text-xs text-openclaw-textMuted">
                {openClawConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
          <div className="p-2 space-y-2">
            {openClawAgents.length > 0 ? (
              openClawAgents.map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-openclaw-bgHover hover:bg-openclaw-cardHover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${agent.color}20` }}
                    >
                      {agent.icon}
                    </div>
                    <div>
                      <p className="font-medium text-openclaw-text text-sm">{agent.name}</p>
                      <p className="text-xs text-openclaw-textMuted capitalize">{agent.status}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    agent.status === 'running' ? 'bg-openclaw-success/20 text-openclaw-success' :
                    'bg-openclaw-textMuted/20 text-openclaw-textMuted'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <WifiOff className="w-8 h-8 text-openclaw-textMuted mx-auto mb-2" />
                <p className="text-openclaw-textMuted text-sm">Gateway não conectado</p>
                <p className="text-xs text-openclaw-textMuted mt-1">Execute 'openclaw gateway start' para conectar</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 400 }}
          className="glass rounded-xl p-4 border"
        >
          <h3 className="font-semibold text-openclaw-text flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-openclaw-success" />
            Status do Sistema
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-openclaw-bg border border-openclaw-border">
              <p className="text-xs text-openclaw-textMuted">Memória</p>
              <p className="text-lg font-semibold text-openclaw-text">{systemStatus?.memory || '--'}%</p>
            </div>
            <div className="p-3 rounded-lg bg-openclaw-bg border border-openclaw-border">
              <p className="text-xs text-openclaw-textMuted">Versão</p>
              <p className="text-lg font-semibold text-openclaw-text">{systemStatus?.version || '1.0.0'}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 500 }}
          className="glass rounded-xl p-4 border"
        >
          <h3 className="font-semibold text-openclaw-text flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-openclaw-warning" />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Novo Agente', icon: Bot, color: 'text-openclaw-primary' },
              { label: 'Executar', icon: Play, color: 'text-openclaw-success' },
              { label: 'Logs', icon: Activity, color: 'text-openclaw-warning' },
              { label: 'Config', icon: Settings, color: 'text-openclaw-textMuted' },
            ].map((action) => (
              <button
                key={action.label}
                className="p-3 rounded-lg bg-openclaw-bg border border-openclaw-border hover:border-openclaw-primary/30 hover:bg-openclaw-cardHover transition-all flex items-center gap-2 group"
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm text-openclaw-textMuted group-hover:text-openclaw-text">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}