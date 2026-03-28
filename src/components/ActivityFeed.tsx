import { useState } from 'react'
import { Activity, Bot, Zap, Clock, CheckCircle, ArrowRight, X } from 'lucide-react'

const sampleActivities = [
  { id: '1', type: 'agent', message: 'Research Agent executou tarefa de pesquisa', time: '2 min atrás', icon: Bot, color: 'text-openclaw-primary', bg: 'bg-openclaw-primary/10' },
  { id: '2', type: 'task', message: 'Tarefa movida para "Em Progresso"', time: '5 min atrás', icon: ArrowRight, color: 'text-openclaw-warning', bg: 'bg-openclaw-warning/10' },
  { id: '3', type: 'success', message: 'Code Agent completou revisão', time: '8 min atrás', icon: CheckCircle, color: 'text-openclaw-success', bg: 'bg-openclaw-success/10' },
  { id: '4', type: 'agent', message: 'Data Agent iniciou análise', time: '12 min atrás', icon: Bot, color: 'text-openclaw-primary', bg: 'bg-openclaw-primary/10' },
  { id: '5', type: 'task', message: 'Nova tarefa adicionada ao backlog', time: '15 min atrás', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
]

interface ActivityFeedProps {
  onClose?: () => void
  collapsed?: boolean
}

export default function ActivityFeed({ onClose, collapsed }: ActivityFeedProps) {
  const [activities] = useState(sampleActivities)

  if (collapsed) return null

  return (
    <div className="h-full flex flex-col bg-openclaw-card border-l border-openclaw-border">
      <div className="p-4 border-b border-openclaw-border flex items-center justify-between">
        <h3 className="font-semibold text-openclaw-text flex items-center gap-2">
          <Activity className="w-5 h-5 text-openclaw-primary" />
          Feed de Atividade
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-openclaw-textMuted">{activities.length} eventos</span>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-openclaw-bgHover text-openclaw-textMuted hover:text-openclaw-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-3 rounded-lg bg-openclaw-bg border border-openclaw-border hover:border-openclaw-primary/30 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg ${activity.bg} ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-openclaw-text line-clamp-2 group-hover:text-openclaw-primary transition-colors">{activity.message}</p>
                <p className="text-xs text-openclaw-textMuted flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-openclaw-border">
        <button className="w-full py-2 text-sm text-openclaw-textMuted hover:text-openclaw-primary transition-colors text-center">
          Ver todo o histórico →
        </button>
      </div>
    </div>
  )
}