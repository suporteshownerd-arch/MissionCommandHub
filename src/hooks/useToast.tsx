import { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message, duration }])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-openclaw-success" />,
    error: <AlertCircle className="w-5 h-5 text-openclaw-error" />,
    info: <Info className="w-5 h-5 text-openclaw-primary" />,
    warning: <AlertTriangle className="w-5 h-5 text-openclaw-warning" />
  }

  const backgrounds = {
    success: 'border-openclaw-success/30 bg-openclaw-success/10',
    error: 'border-openclaw-error/30 bg-openclaw-error/10',
    info: 'border-openclaw-primary/30 bg-openclaw-primary/10',
    warning: 'border-openclaw-warning/30 bg-openclaw-warning/10'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`flex items-start gap-3 p-4 rounded-lg border ${backgrounds[toast.type]} backdrop-blur-sm shadow-lg`}
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-openclaw-text">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-openclaw-textMuted hover:text-openclaw-text"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}