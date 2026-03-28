import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, Command, Bot, Layers3, LayoutDashboard, Globe, Activity, Settings } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'view' | 'skill'
  label: string
  description?: string
  icon: React.ElementType
  action: () => void
}

interface GlobalSearchProps {
  onClose: () => void
}

const views = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Visão geral do sistema' },
  { id: 'agents', label: 'Agentes', icon: Bot, description: 'Gerenciar agentes' },
  { id: 'mcp', label: 'MCP', icon: Command, description: 'Model Context Protocol' },
  { id: 'kanban', label: 'Tasks', icon: LayoutDashboard, description: 'Task board' },
  { id: 'integrations', label: 'Integrações', icon: Globe, description: 'Conectores externos' },
  { id: 'monitor', label: 'Monitor', icon: Activity, description: 'Status do sistema' },
  { id: 'framework', label: 'Framework', icon: Layers3, description: 'Skills e agentes' },
  { id: 'settings', label: 'Configurações', icon: Settings, description: 'Preferências do app' },
]

const skills = [
  { id: 'dev', label: 'Dev', description: 'Desenvolvimento de código' },
  { id: 'qa', label: 'QA', description: 'Quality Assurance' },
  { id: 'pm', label: 'PM', description: 'Project Manager' },
  { id: 'architect', label: 'Architect', description: 'Arquitetura de sistemas' },
  { id: 'analyst', label: 'Analyst', description: 'Análise de requisitos' },
]

export default function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const searchInItems = (
      items: { id: string; label: string; description?: string; icon?: React.ElementType }[],
      type: SearchResult['type'],
      fallbackIcon: React.ElementType
    ) => items.filter(item => item.label.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)).map(item => ({
      id: `${type}-${item.id}`,
      type,
      label: item.label,
      description: item.description,
      icon: item.icon || fallbackIcon,
      action: () => onClose()
    }))

    return [...searchInItems(views, 'view', LayoutDashboard), ...searchInItems(skills, 'skill', Layers3)].slice(0, 8)
  }, [query, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, Math.max(results.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      results[selectedIndex].action()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl glass rounded-xl border overflow-hidden shadow-2xl transition-all duration-150" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-openclaw-border">
          <Search className="w-5 h-5 text-openclaw-textMuted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar agentes, skills, visualizações..."
            className="flex-1 bg-transparent text-openclaw-text placeholder-openclaw-textMuted focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-openclaw-bg border border-openclaw-border text-xs text-openclaw-textMuted">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {query.trim().length === 0 ? (
            <div className="p-4 text-center text-openclaw-textMuted text-sm"><p>Comece a digitar para buscar...</p></div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-openclaw-textMuted"><Search className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>Nenhum resultado encontrado</p></div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={result.action}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${index === selectedIndex ? 'bg-openclaw-primary/15 text-openclaw-primary' : 'text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text'}`}
                >
                  <result.icon className="w-4 h-4" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{result.label}</p>
                    {result.description && <p className="text-xs text-openclaw-textMuted">{result.description}</p>}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-openclaw-bg border border-openclaw-border">{result.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}