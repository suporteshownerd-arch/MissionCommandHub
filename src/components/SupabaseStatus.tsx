import { useState, useEffect } from 'react'
import { Database, RefreshCw, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useSupabase } from '../hooks/useSupabase'

export default function SupabaseStatus() {
  const { connected, loading, error, testConnection } = useSupabase()
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Testar conexão a cada 30 segundos
    const interval = setInterval(testConnection, 30000)
    return () => clearInterval(interval)
  }, [testConnection])

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-openclaw-bg border border-openclaw-border hover:border-openclaw-borderLight transition-colors"
      >
        <Database className="w-4 h-4" />
        <span className="text-xs text-openclaw-muted">Supabase</span>
        <div className={`w-2 h-2 rounded-full ${
          loading ? 'bg-openclaw-warning animate-pulse' :
          connected ? 'bg-openclaw-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
          'bg-openclaw-error'
        }`} />
      </button>

      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 rounded-lg bg-openclaw-card border border-openclaw-border shadow-lg z-50">
          <div className="flex items-center gap-2 mb-2">
            {loading ? (
              <Loader className="w-4 h-4 animate-spin text-openclaw-warning" />
            ) : connected ? (
              <CheckCircle className="w-4 h-4 text-openclaw-success" />
            ) : (
              <AlertCircle className="w-4 h-4 text-openclaw-error" />
            )}
            <span className="text-sm font-medium text-openclaw-text">
              {loading ? 'Conectando...' : connected ? 'Conectado' : 'Erro'}
            </span>
          </div>
          
          {!connected && error && (
            <p className="text-xs text-openclaw-error mb-2">{error}</p>
          )}
          
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-openclaw-bg hover:bg-openclaw-bgHover text-openclaw-text text-sm transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Testar Conexão
          </button>
        </div>
      )}
    </div>
  )
}