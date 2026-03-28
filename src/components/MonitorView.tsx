import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Cpu, Zap, RefreshCw, Server, Clock, Wifi, WifiOff } from 'lucide-react'
import { useOpenClaw } from '../hooks/useOpenClaw'

interface StatCard {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bgColor: string
}

export default function MonitorView() {
  const { status, agents, loading, refresh } = useOpenClaw()
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (!loading) {
      setLastUpdate(new Date())
    }
  }, [loading])

  const stats: StatCard[] = [
    { 
      label: 'Gateway', 
      value: status.connected ? 'Online' : 'Offline', 
      icon: status.connected ? Wifi : WifiOff, 
      color: status.connected ? 'text-openclaw-success' : 'text-openclaw-error', 
      bgColor: status.connected ? 'bg-openclaw-success/10' : 'bg-openclaw-error/10' 
    },
    { label: 'Uptime', value: status.uptime || '--', icon: Clock, color: 'text-openclaw-warning', bgColor: 'bg-openclaw-warning/10' },
    { label: 'Versão', value: status.version || '1.0.0', icon: Cpu, color: 'text-openclaw-accent', bgColor: 'bg-openclaw-accent/10' },
    { label: 'Memória', value: status.memory ? `${status.memory}%` : '--', icon: Server, color: 'text-openclaw-primary', bgColor: 'bg-openclaw-primary/10' },
  ]

  const getAgentStatus = (agentStatus: string) => {
    switch (agentStatus) {
      case 'running': return { color: 'bg-openclaw-success', text: 'Executando', glow: true }
      case 'thinking': return { color: 'bg-openclaw-warning', text: 'Pensando', glow: true }
      case 'error': return { color: 'bg-openclaw-error', text: 'Erro', glow: false }
      default: return { color: 'bg-openclaw-textMuted', text: 'Inativo', glow: false }
    }
  }

  return (
    <div className="h-full overflow-y-auto space-y-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-openclaw-text">Monitor</h2>
          <p className="text-sm text-openclaw-textMuted">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <button 
          onClick={refresh}
          disabled={loading}
          className="p-2 rounded-lg bg-openclaw-card border border-openclaw-border text-openclaw-textMuted hover:text-openclaw-primary hover:border-openclaw-primary/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Agent Status */}
      <div className="glass rounded-xl p-5 border">
        <h3 className="text-lg font-semibold text-openclaw-text mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-openclaw-primary" />
          Status dos Agentes
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin text-openclaw-primary" />
          </div>
        ) : agents.length > 0 ? (
          <div className="space-y-3">
            {agents.map((agent) => {
              const statusInfo = getAgentStatus(agent.status)
              return (
                <div 
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-openclaw-bg border border-openclaw-border hover:border-openclaw-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} ${statusInfo.glow ? 'animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : ''}`} />
                    <span className="font-medium text-openclaw-text">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-openclaw-textMuted">{statusInfo.text}</span>
                    <button className="p-1.5 rounded hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
                      <Activity className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <WifiOff className="w-8 h-8 text-openclaw-textMuted mx-auto mb-2" />
            <p className="text-openclaw-textMuted text-sm">Gateway não conectado</p>
            <p className="text-xs text-openclaw-textMuted mt-1">Execute 'openclaw gateway start' para conectar</p>
          </div>
        )}
      </div>

      {/* System Logs Preview */}
      <div className="glass rounded-xl p-5 border">
        <h3 className="text-lg font-semibold text-openclaw-text mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-openclaw-success" />
          Logs do Sistema
        </h3>
        <div className="bg-openclaw-bg rounded-lg border border-openclaw-border p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
          <div className="text-openclaw-textMuted">[2026-03-28 01:25:00] Sistema iniciado</div>
          <div className="text-openclaw-textMuted">[2026-03-28 01:25:01] Carregando configurações...</div>
          <div className="text-openclaw-textMuted">[2026-03-28 01:25:02] Conectando ao Gateway...</div>
          {status.connected ? (
            <div className="text-openclaw-success">[2026-03-28 01:25:03] Gateway conectado com sucesso</div>
          ) : (
            <div className="text-openclaw-error">[2026-03-28 01:25:03] Falha ao conectar ao Gateway</div>
          )}
          <div className="text-openclaw-textMuted">[2026-03-28 01:25:04] Carregando {agents.length} agentes...</div>
          <div className="text-openclaw-textMuted">[2026-03-28 01:25:05] Pronto!</div>
        </div>
      </div>
    </div>
  )
}