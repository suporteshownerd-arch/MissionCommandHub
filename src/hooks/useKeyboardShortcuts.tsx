import { useEffect, useCallback, useState } from 'react'

interface Shortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  description: string
  action: () => void
}

interface UseKeyboardShortcutsOptions {
  shortcuts: Shortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return
    
    // Ignore if typing in input
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
      const altMatch = shortcut.alt ? e.altKey : !e.altKey
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        e.preventDefault()
        shortcut.action()
        break
      }
    }
  }, [shortcuts, enabled])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: Shortcut[] }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleToggle = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.shiftKey || e.metaKey)) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleToggle)
    return () => window.removeEventListener('keydown', handleToggle)
  }, [])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="glass rounded-xl border p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-openclaw-text mb-4">Atalhos de Teclado</h3>
        <div className="space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-openclaw-textMuted">{s.description}</span>
              <div className="flex gap-1">
                {s.ctrl && <kbd className="px-2 py-1 rounded bg-openclaw-bg text-xs text-openclaw-text border border-openclaw-border">Ctrl</kbd>}
                {s.alt && <kbd className="px-2 py-1 rounded bg-openclaw-bg text-xs text-openclaw-text border border-openclaw-border">Alt</kbd>}
                {s.shift && <kbd className="px-2 py-1 rounded bg-openclaw-bg text-xs text-openclaw-text border border-openclaw-border">Shift</kbd>}
                <kbd className="px-2 py-1 rounded bg-openclaw-primary/20 text-xs text-openclaw-primary border border-openclaw-primary/30">{s.key.toUpperCase()}</kbd>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-openclaw-textMuted mt-4 text-center">Pressione <kbd className="px-1.5 py-0.5 rounded bg-openclaw-bg border border-openclaw-border">?</kbd> para fechar</p>
      </div>
    </div>
  )
}

// Default shortcuts
export const defaultShortcuts = [
  { key: '1', description: 'Dashboard' },
  { key: '2', description: 'Agentes' },
  { key: '3', description: 'MCP' },
  { key: '4', description: 'Tasks' },
  { key: '5', description: 'Integrações' },
  { key: '6', description: 'Monitor' },
  { key: '7', description: 'Framework' },
  { key: ',', ctrl: true, description: 'Configurações' },
  { key: 'b', ctrl: true, description: 'Toggle Sidebar' },
  { key: 'j', ctrl: true, description: 'Toggle Activity' },
  { key: 'r', ctrl: true, description: 'Refresh' },
  { key: '?', shift: true, description: 'Mostrar atalhos' },
] as const