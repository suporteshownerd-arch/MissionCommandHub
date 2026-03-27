import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Settings, 
  Activity, 
  Cpu,
  Workflow,
  PanelRightClose,
  PanelRightOpen,
  Command,
  Play,
  Square,
  Clock,
  Zap,
  Wifi,
  Database
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import AgentPanel from './components/AgentPanel'
import ActivityFeed from './components/ActivityFeed'
import IntegrationCards from './components/IntegrationCards'
import SupabaseStatus from './components/SupabaseStatus'

type View = 'agents' | 'kanban' | 'integrations' | 'monitor'

function App() {
  const [currentView, setCurrentView] = useState<View>('agents')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activityCollapsed, setActivityCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-openclaw-bg overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <div className="h-14 border-b border-openclaw-border flex items-center justify-between px-4 bg-openclaw-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Status Indicators */}
            <div className="flex items-center gap-3">
              {/* Sistema Online */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-openclaw-success animate-pulse" />
                <span className="text-sm text-openclaw-textMuted">Online</span>
              </div>
              
              {/* OpenClaw Status */}
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-openclaw-bg border border-openclaw-border">
                <Wifi className="w-3 h-3 text-openclaw-accent" />
                <span className="text-xs text-openclaw-textMuted">OpenClaw</span>
              </div>
              
              {/* Supabase Status */}
              <SupabaseStatus />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-openclaw-textMuted font-mono">{new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Panel */}
          <motion.div 
            layout
            className="flex-1 flex flex-col overflow-hidden p-4"
          >
            <AnimatePresence mode="wait">
              {currentView === 'agents' && (
                <motion.div
                  key="agents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 overflow-hidden"
                >
                  <AgentPanel />
                </motion.div>
              )}
              {currentView === 'kanban' && (
                <motion.div
                  key="kanban"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 overflow-auto"
                >
                  <KanbanView />
                </motion.div>
              )}
              {currentView === 'integrations' && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 overflow-auto"
                >
                  <IntegrationCards />
                </motion.div>
              )}
              {currentView === 'monitor' && (
                <motion.div
                  key="monitor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 overflow-auto"
                >
                  <MonitorView />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Panel - Activity Feed (Collapsible) */}
          <AnimatePresence>
            {!activityCollapsed && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-openclaw-border flex flex-col overflow-hidden"
              >
                <ActivityFeed />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Activity Button */}
          <button
            onClick={() => setActivityCollapsed(!activityCollapsed)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-openclaw-card border border-openclaw-border text-openclaw-textMuted hover:text-openclaw-primary hover:border-openclaw-primary/50 transition-colors"
          >
            {activityCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

function KanbanView() {
  const columns = [
    { name: 'Backlog', color: 'bg-openclaw-textMuted' },
    { name: 'In Progress', color: 'bg-openclaw-primary' },
    { name: 'Review', color: 'bg-openclaw-warning' },
    { name: 'Done', color: 'bg-openclaw-success' }
  ]
  
  const tasks = [
    { title: 'Implementar autenticação OAuth2', column: 'Backlog' },
    { title: 'Revisar PR #42', column: 'Review' },
    { title: 'Deploy staging', column: 'In Progress' },
    { title: 'Atualizar documentação', column: 'Done' },
  ]
  
  return (
    <div className="h-full flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div 
          key={column.name}
          className="flex-shrink-0 w-72 bg-openclaw-card rounded-xl border border-openclaw-border flex flex-col"
        >
          <div className="p-4 border-b border-openclaw-border">
            <h3 className="font-semibold text-openclaw-text flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${column.color}`} />
              {column.name}
            </h3>
            <span className="text-xs text-openclaw-textMuted mt-1 block">
              {tasks.filter(t => t.column === column.name).length} tarefas
            </span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {tasks.filter(t => t.column === column.name).map((task, i) => (
              <div 
                key={i}
                className="bg-openclaw-bgHover rounded-lg p-3 border border-openclaw-border hover:border-openclaw-primary/30 transition-colors cursor-pointer group"
              >
                <p className="text-sm text-openclaw-text group-hover:text-openclaw-primary transition-colors">{task.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-openclaw-textMuted" />
                  <span className="text-xs text-openclaw-textMuted">Hoje</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MonitorView() {
  const stats = [
    { label: 'Active Agents', value: '3', icon: Bot, color: 'text-openclaw-primary', bg: 'bg-openclaw-primary/10' },
    { label: 'Tasks Today', value: '12', icon: Workflow, color: 'text-openclaw-success', bg: 'bg-openclaw-success/10' },
    { label: 'Uptime', value: '99.9%', icon: Activity, color: 'text-openclaw-warning', bg: 'bg-openclaw-warning/10' },
    { label: 'API Calls', value: '1.2k', icon: Cpu, color: 'text-openclaw-accent', bg: 'bg-openclaw-accent/10' },
  ]
  
  const agents = [
    { name: 'Research Agent', status: 'running', tasks: 5 },
    { name: 'Code Agent', status: 'running', tasks: 3 },
    { name: 'Data Agent', status: 'idle', tasks: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 100 }}
            className="glass rounded-xl p-5 hover:border-openclaw-primary/30 transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-openclaw-text">{stat.value}</p>
            <p className="text-sm text-openclaw-textMuted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Agent Status */}
      <div className="glass rounded-xl p-5 border">
        <h3 className="text-lg font-semibold text-openclaw-text mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-openclaw-primary" />
          Status dos Agentes
        </h3>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div 
              key={agent.name}
              className="flex items-center justify-between p-3 rounded-lg bg-openclaw-bg border border-openclaw-border hover:border-openclaw-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${agent.status === 'running' ? 'bg-openclaw-success animate-pulse' : 'bg-openclaw-textMuted'}`} />
                <span className="font-medium text-openclaw-text">{agent.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-openclaw-textMuted">{agent.tasks} tarefas</span>
                <button className="p-1.5 rounded hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
                  {agent.status === 'running' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App