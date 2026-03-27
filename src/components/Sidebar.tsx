import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Settings, 
  Activity, 
  MessageSquare,
  LayoutDashboard,
  Globe,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
  Command
} from 'lucide-react'

type View = 'agents' | 'kanban' | 'integrations' | 'monitor' | 'chat'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentView: View
  onViewChange: (view: View) => void
}

const menuItems = [
  { id: 'agents', label: 'Agentes', icon: Bot },
  { id: 'kanban', label: 'Task Board', icon: LayoutDashboard },
  { id: 'integrations', label: 'Integrações', icon: Globe },
  { id: 'monitor', label: 'Monitor', icon: Activity },
] as const

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const sampleMessages: Message[] = [
  { id: '1', role: 'user', content: 'Qual é o status dos agentes?', time: '2 min' },
  { id: '2', role: 'assistant', content: 'Todos os 3 agentes estão ativos e funcionando!', time: '1 min' },
]

export default function Sidebar({ collapsed, onToggle, currentView, onViewChange }: SidebarProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      time: 'agora'
    }
    setMessages([...messages, newMessage])
    setInputValue('')
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Entendi sua mensagem! Em breve terei mais funcionalidades.',
        time: 'agora'
      }])
    }, 1000)
  }

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: collapsed ? 72 : 320 }}
      className="h-full bg-openclaw-card border-r border-openclaw-border flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-openclaw-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-openclaw-primary to-orange-600 flex items-center justify-center shadow-glow-primary">
              <Command className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-openclaw-text block leading-tight">Mission</span>
              <span className="text-xs text-openclaw-primary font-medium">Command Hub</span>
            </div>
          </motion.div>
        )}
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      {!collapsed && (
        <nav className="p-3 space-y-1 border-b border-openclaw-border">
          {menuItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as View)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-openclaw-primary/15 text-openclaw-primary border border-openclaw-primary/30 shadow-glow-primary' 
                    : 'text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text border border-transparent'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      )}

      {/* Chat Panel */}
      {!collapsed && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="p-3 border-b border-openclaw-border flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-openclaw-primary" />
            <span className="text-sm font-medium text-openclaw-text">Chat Agent</span>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-openclaw-primary text-white shadow-glow-primary'
                      : 'bg-openclaw-bgHover text-openclaw-text border border-openclaw-border'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-openclaw-textMuted'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-openclaw-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-openclaw-bg border border-openclaw-border rounded-lg px-3 py-2 text-sm text-openclaw-text placeholder-openclaw-textMuted focus:outline-none focus:border-openclaw-primary focus:ring-1 focus:ring-openclaw-primary/50 transition-all"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-lg bg-openclaw-primary hover:bg-openclaw-primaryHover text-white transition-colors shadow-glow-primary hover:shadow-[0_0_25px_rgba(255,92,92,0.5)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-openclaw-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text transition-colors">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Configurações</span>}
        </button>
      </div>
    </motion.aside>
  )
}