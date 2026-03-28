import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PanelRightClose,
  PanelRightOpen,
  Zap,
  Settings
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AgentPanel from './components/AgentPanel'
import MCPPanel from './components/MCPPanel'
import ActivityFeed from './components/ActivityFeed'
import IntegrationCards from './components/IntegrationCards'
import SupabaseStatus from './components/SupabaseStatus'
import FrameworkOverview from './components/FrameworkOverview'
import KanbanView from './components/KanbanView'
import SettingsView from './components/Settings'
import MonitorView from './components/MonitorView'
import { ToastProvider } from './hooks/useToast'
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from './hooks/useKeyboardShortcuts'

type View = 'dashboard' | 'agents' | 'mcp' | 'kanban' | 'integrations' | 'monitor' | 'framework' | 'settings'

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activityCollapsed, setActivityCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const shortcuts = [
    { key: '1', description: 'Dashboard', action: () => setCurrentView('dashboard') },
    { key: '2', description: 'Agentes', action: () => setCurrentView('agents') },
    { key: '3', description: 'MCP', action: () => setCurrentView('mcp') },
    { key: '4', description: 'Tasks', action: () => setCurrentView('kanban') },
    { key: '5', description: 'Integrações', action: () => setCurrentView('integrations') },
    { key: '6', description: 'Monitor', action: () => setCurrentView('monitor') },
    { key: '7', description: 'Framework', action: () => setCurrentView('framework') },
    { key: ',', ctrl: true, description: 'Configurações', action: () => setSettingsOpen(true) },
    { key: 'b', ctrl: true, description: 'Toggle Sidebar', action: () => setSidebarCollapsed(p => !p) },
    { key: 'j', ctrl: true, description: 'Toggle Activity', action: () => setActivityCollapsed(p => !p) },
  ]

  useKeyboardShortcuts({ shortcuts })

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />
      case 'agents': return <AgentPanel />
      case 'mcp': return <MCPPanel />
      case 'kanban': return <KanbanView />
      case 'integrations': return <IntegrationCards />
      case 'monitor': return <MonitorView />
      case 'framework': return <FrameworkOverview />
      case 'settings': return <div className="h-full flex items-center justify-center text-openclaw-textMuted"><div className="text-center"><Settings className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>Use o botão de configurações na sidebar</p></div></div>
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-openclaw-bg overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'settings') setSettingsOpen(true)
          else setCurrentView(view)
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-openclaw-border flex items-center justify-between px-4 bg-openclaw-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-openclaw-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-sm text-openclaw-text font-medium">Online</span>
            </div>
            <div className="w-px h-6 bg-openclaw-border" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-openclaw-bg border border-openclaw-border">
              <Zap className="w-3.5 h-3.5 text-openclaw-accent" />
              <span className="text-xs text-openclaw-textMuted">OpenClaw</span>
            </div>
            <SupabaseStatus />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <span className="text-xs text-openclaw-textMuted font-mono">{new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <motion.div layout className="flex-1 flex flex-col overflow-hidden p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {!activityCollapsed && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-l border-openclaw-border flex flex-col overflow-hidden bg-openclaw-card/30"
              >
                <ActivityFeed />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setActivityCollapsed(!activityCollapsed)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-openclaw-card border border-openclaw-border text-openclaw-textMuted hover:text-openclaw-primary hover:border-openclaw-primary/50 transition-all shadow-lg"
          >
            {activityCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <SettingsView isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <KeyboardShortcutsHelp shortcuts={shortcuts} />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}