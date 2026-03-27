import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  LayoutDashboard, 
  Globe, 
  Activity, 
  MessageSquare,
  Sun,
  Moon,
  Bell,
  Search,
  Command,
  Plus,
  FolderOpen
} from 'lucide-react'

type View = 'agents' | 'kanban' | 'integrations' | 'monitor' | 'chat'

interface HeaderProps {
  onViewChange: (view: View) => void
}

const viewIcons = {
  agents: Bot,
  kanban: LayoutDashboard,
  integrations: Globe,
  monitor: Activity,
  chat: MessageSquare,
}

const viewLabels = {
  agents: 'Centro de Comando',
  kanban: 'Quadro de Tarefas',
  integrations: 'Integrações',
  monitor: 'Monitor',
  chat: 'Dúvidas & Chat',
}

export default function Header({ onViewChange }: HeaderProps) {
  const [darkMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-16 bg-openclaw-card border-b border-openclaw-border flex items-center justify-between px-6">
      {/* Left - View Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-openclaw-cardHover rounded-lg p-1">
          {(Object.keys(viewLabels) as View[]).map((view) => {
            const Icon = viewIcons[view]
            return (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-openclaw-textMuted hover:text-openclaw-text transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{viewLabels[view]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-openclaw-textMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar agentes, tarefas..."
            className="w-full bg-openclaw-cardHover border border-openclaw-border rounded-lg pl-10 pr-20 py-2 text-sm text-openclaw-text placeholder-openclaw-textMuted focus:outline-none focus:border-openclaw-accent transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-openclaw-textMuted">
            <Command className="w-3 h-3" />
            <span className="text-xs">/</span>
          </div>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-openclaw-accent rounded-full" />
        </button>

        {/* Theme Toggle (visual only) */}
        <button className="p-2 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors">
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-openclaw-success/20 rounded-full border border-openclaw-success/30">
          <span className="w-2 h-2 bg-openclaw-success rounded-full animate-pulse" />
          <span className="text-sm text-openclaw-success font-medium">API Online</span>
        </div>
      </div>
    </header>
  )
}