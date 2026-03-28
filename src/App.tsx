import { useState, useEffect, lazy, Suspense } from 'react'
import {
  PanelRightClose,
  PanelRightOpen,
  Zap,
  Settings
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AgentPanel from './components/AgentPanel'
import ActivityFeed from './components/ActivityFeed'
import SupabaseStatus from './components/SupabaseStatus'
import { ToastProvider } from './hooks/useToast'
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from './hooks/useKeyboardShortcuts'

const MCPPanel = lazy(() => import('./components/MCPPanel'))
const IntegrationCards = lazy(() => import('./components/IntegrationCards'))
const FrameworkOverview = lazy(() => import('./components/FrameworkOverview'))
const KanbanView = lazy(() => import('./components/KanbanView'))
const SettingsView = lazy(() => import('./components/Settings'))
const MonitorView = lazy(() => import('./components/MonitorView'))
const GlobalSearch = lazy(() => import('./components/GlobalSearch'))

type View = 'dashboard' | 'agents' | 'mcp' | 'kanban' | 'integrations' | 'monitor' | 'framework' | 'settings'

function LoadingView() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-openclaw-primary/30 border-t-openclaw-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-openclaw-textMuted">Carregando...</p>
      </div>
    </div>
  )
}

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activityCollapsed, setActivityCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const shortcuts = [
    { key: '1', description: 'Dashboard', action: () => setCurrentView('dashboard') },
    { key: '2', description: 'Agentes', action: () => setCurrentView('agents') },
    { key: '3', description: 'MCP', action: () => setCurrentView('mcp') },
    { key: '4', description: 'Tasks', action: () => setCurrentView('kanban') },
    { key: '5', description: 'Integrações', action: () => setCurrentView('integrations') },
    { key: '6', description: 'Monitor', action: () => setCurrentView('monitor') },
    { key: '7', description: 'Framework', action: () => setCurrentView('framework') },
    { key: ',', ctrl: true, description: 'Configurações', action: () => setSettingsOpen(true) },
    { key: 'k', ctrl: true, description: 'Busca Global', action: () => setSearchOpen(true) },
    { key: 'b', ctrl: true, description: 'Toggle Sidebar', action: () => setSidebarCollapsed(p => !p) },
    { key: 'j', ctrl: true, description: 'Toggle Activity', action: () => setActivityCollapsed(p => !p) },
  ]

  useKeyboardShortcuts({ shortcuts })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'agents':
        return <AgentPanel />
      case 'mcp':
        return <MCPPanel />
      case 'kanban':
        return <KanbanView />
      case 'integrations':
        return <IntegrationCards />
      case 'monitor':
        return <MonitorView />
      case 'framework':
        return <FrameworkOverview />
      case 'settings':
        return (
          <div className="h-full flex items-center justify-center text-openclaw-textMuted">
            <div className="text-center">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Use o botão de configurações na sidebar</p>
            </div>
          </div>
        )
      default:
        return <Dashboard />
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
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-openclaw-bg border border-openclaw-border text-openclaw-textMuted hover:text-openclaw-text transition-colors"
            >
              <span className="text-xs">Ctrl+K</span>
            </button>
            <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <span className="text-xs text-openclaw-textMuted font-mono">{new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 flex flex-col overflow-hidden p-4 transition-all duration-150 ease-out">
            <div className="flex-1 overflow-hidden animate-in fade-in duration-200">
              <Suspense fallback={<LoadingView />}>
                {renderContent()}
              </Suspense>
            </div>
          </div>

          {!activityCollapsed && (
            <div className="border-l border-openclaw-border flex flex-col overflow-hidden bg-openclaw-card/30 w-80 transition-all duration-200 ease-out">
              <ActivityFeed />
            </div>
          )}

          <button
            onClick={() => setActivityCollapsed(!activityCollapsed)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-openclaw-card border border-openclaw-border text-openclaw-textMuted hover:text-openclaw-primary hover:border-openclaw-primary/50 transition-all shadow-lg"
          >
            {activityCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Suspense fallback={null}>
        <SettingsView isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
      </Suspense>
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