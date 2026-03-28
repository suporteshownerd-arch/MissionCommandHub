import { useState } from 'react'
import { 
  Bot, 
  Settings, 
  Activity, 
  MessageSquare,
  LayoutDashboard,
  Globe,
  Layers3,
  ChevronLeft,
  ChevronRight,
  Send,
  Command,
  Trash2,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useChat } from '../hooks/useChat'

type View = 'dashboard' | 'agents' | 'mcp' | 'kanban' | 'integrations' | 'monitor' | 'framework' | 'settings'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentView: View
  onViewChange: (view: View) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agents', label: 'Agentes', icon: Bot },
  { id: 'mcp', label: 'MCP', icon: Command },
  { id: 'kanban', label: 'Tasks', icon: LayoutDashboard },
  { id: 'integrations', label: 'Int.', icon: Globe },
  { id: 'monitor', label: 'Monitor', icon: Activity },
  { id: 'framework', label: 'Framework', icon: Layers3 },
] as const

export default function Sidebar({ collapsed, onToggle, currentView, onViewChange }: SidebarProps) {
  const { messages, loading, connected, sendMessage, clearHistory } = useChat()
  const [inputValue, setInputValue] = useState('')

  const handleSend = async () => {
    if (!inputValue.trim()) return
    const value = inputValue
    setInputValue('')
    await sendMessage(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <aside className={`h-full bg-openclaw-card border-r border-openclaw-border flex flex-col transition-all duration-200 ${collapsed ? 'w-[72px]' : 'w-[320px]'}`}>
      <div className="p-3 flex items-center justify-between border-b border-openclaw-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-openclaw-primary to-orange-600 flex items-center justify-center shadow-glow-primary">
              <Command className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-openclaw-text block leading-tight text-sm">Mission</span>
              <span className="text-xs text-openclaw-primary font-medium">Hub</span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-openclaw-primary to-orange-600 flex items-center justify-center shadow-glow-primary mx-auto">
            <Command className="w-4 h-4 text-white" />
          </div>
        )}
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className={`p-2 space-y-1 border-b border-openclaw-border ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {menuItems.map((item) => {
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-openclaw-primary/15 text-openclaw-primary border border-openclaw-primary/30 shadow-glow-primary' : 'text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text border border-transparent'}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="p-3 border-b border-openclaw-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-openclaw-primary" />
              <span className="text-sm font-medium text-openclaw-text">Chat</span>
            </div>
            {connected ? <Wifi className="w-3.5 h-3.5 text-openclaw-success" /> : <WifiOff className="w-3.5 h-3.5 text-openclaw-textMuted" />}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-openclaw-textMuted text-sm">
                <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                <p>Envie uma mensagem</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2.5 rounded-lg text-sm ${msg.role === 'user' ? 'bg-openclaw-primary text-white shadow-glow-primary' : 'bg-openclaw-bgHover text-openclaw-text border border-openclaw-border'}`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-openclaw-textMuted'}`}>
                      {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-openclaw-bgHover p-3 rounded-lg border border-openclaw-border">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-openclaw-textMuted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-openclaw-textMuted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-openclaw-textMuted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-openclaw-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mensagem..."
                className="flex-1 bg-openclaw-bg border border-openclaw-border rounded-lg px-3 py-2 text-sm text-openclaw-text placeholder-openclaw-textMuted focus:outline-none focus:border-openclaw-primary focus:ring-1 focus:ring-openclaw-primary/50 transition-all"
              />
              <button onClick={handleSend} disabled={loading || !inputValue.trim()} className="p-2 rounded-lg bg-openclaw-primary hover:bg-openclaw-primaryHover text-white transition-colors shadow-glow-primary hover:shadow-[0_0_25px_rgba(255,92,92,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="px-3 pb-2">
              <button onClick={clearHistory} className="text-xs text-openclaw-textMuted hover:text-openclaw-error transition-colors flex items-center gap-1">
                <Trash2 className="w-3 h-3" />
                Limpar
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`p-2 border-t border-openclaw-border ${collapsed ? 'flex flex-col items-center gap-1' : ''}`}>
        <button onClick={() => onViewChange('settings')} title="Configurações" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text transition-colors w-full ${collapsed ? 'justify-center' : ''}`}>
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Configurações</span>}
        </button>
      </div>
    </aside>
  )
}