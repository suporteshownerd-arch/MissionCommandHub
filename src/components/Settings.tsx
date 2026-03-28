import { useState, useEffect } from 'react'
import { 
  X, 
  Sun, 
  Moon, 
  Globe, 
  Key, 
  Bell, 
  Shield, 
  Palette,
  RefreshCw,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { useToast } from '../hooks/useToast'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = 'general' | 'api' | 'appearance' | 'notifications'

interface AppSettings {
  theme: 'dark' | 'light'
  openclawUrl: string
  supabaseUrl: string
  supabaseKey: string
  notifications: {
    agentStart: boolean
    agentComplete: boolean
    errors: boolean
  }
  autoRefresh: boolean
  refreshInterval: number
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  openclawUrl: 'http://localhost:3456',
  supabaseUrl: 'https://sb-publishable-i-7uiojc0ratsj5qqsvmjg-jmff-okp.supabase.co',
  supabaseKey: '',
  notifications: { agentStart: true, agentComplete: true, errors: true },
  autoRefresh: true,
  refreshInterval: 30
}

const STORAGE_KEY = 'openclaw-settings'

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) }
  } catch (e) {
    console.warn('Failed to load settings:', e)
  }
  return defaultSettings
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [saved, setSaved] = useState(false)
  const [testingApi, setTestingApi] = useState(false)
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { addToast } = useToast()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const handleSave = () => {
    setSaved(true)
    addToast('success', 'Configurações salvas com sucesso!')
    setTimeout(() => setSaved(false), 2000)
  }

  const testConnection = async () => {
    setTestingApi(true)
    setApiStatus('idle')
    try {
      const res = await fetch(`${settings.openclawUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) })
      setApiStatus(res.ok ? 'success' : 'error')
    } catch {
      setApiStatus('error')
      addToast('error', 'Falha ao conectar no Gateway')
    } finally {
      setTestingApi(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'api', label: 'API', icon: Key },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ] as const

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="glass rounded-xl border w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden transition-all duration-150">
        <div className="p-4 border-b border-openclaw-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-openclaw-text flex items-center gap-2"><Shield className="w-5 h-5 text-openclaw-primary" />Configurações</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-openclaw-cardHover text-openclaw-textMuted hover:text-openclaw-text transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-openclaw-border p-2 space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === tab.id ? 'bg-openclaw-primary/15 text-openclaw-primary' : 'text-openclaw-textMuted hover:bg-openclaw-bgHover hover:text-openclaw-text'}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-openclaw-textMuted uppercase tracking-wider">Geral</h3>
                <div className="flex items-center justify-between p-3 rounded-lg bg-openclaw-bg border border-openclaw-border">
                  <div><p className="text-sm text-openclaw-text font-medium">Auto-refresh</p><p className="text-xs text-openclaw-textMuted">Atualizar dados automaticamente</p></div>
                  <button onClick={() => setSettings(s => ({ ...s, autoRefresh: !s.autoRefresh }))} className={`w-11 h-6 rounded-full transition-colors ${settings.autoRefresh ? 'bg-openclaw-primary' : 'bg-openclaw-border'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.autoRefresh ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {settings.autoRefresh && (
                  <div className="p-3 rounded-lg bg-openclaw-bg border border-openclaw-border">
                    <p className="text-sm text-openclaw-text mb-2">Intervalo de refresh: {settings.refreshInterval}s</p>
                    <input type="range" min="10" max="120" step="10" value={settings.refreshInterval} onChange={e => setSettings(s => ({ ...s, refreshInterval: Number(e.target.value) }))} className="w-full accent-openclaw-primary" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-openclaw-textMuted uppercase tracking-wider">Configurações de API</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-openclaw-text block mb-1">OpenClaw Gateway URL</label>
                    <div className="flex gap-2">
                      <input type="text" value={settings.openclawUrl} onChange={e => setSettings(s => ({ ...s, openclawUrl: e.target.value }))} placeholder="http://localhost:3456" className="flex-1 bg-openclaw-bg border border-openclaw-border rounded-lg px-3 py-2 text-sm text-openclaw-text placeholder-openclaw-textMuted focus:outline-none focus:border-openclaw-primary" />
                      <button onClick={testConnection} disabled={testingApi} className="px-3 py-2 rounded-lg bg-openclaw-primary/20 text-openclaw-primary hover:bg-openclaw-primary/30 transition-colors text-sm flex items-center gap-2">{testingApi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}Testar</button>
                    </div>
                    {apiStatus !== 'idle' && <div className={`flex items-center gap-2 mt-2 text-sm ${apiStatus === 'success' ? 'text-openclaw-success' : 'text-openclaw-error'}`}>{apiStatus === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{apiStatus === 'success' ? 'Conexão estabelecida!' : 'Falha na conexão'}</div>}
                  </div>
                  <div>
                    <label className="text-sm text-openclaw-text block mb-1">Supabase URL</label>
                    <input type="text" value={settings.supabaseUrl} onChange={e => setSettings(s => ({ ...s, supabaseUrl: e.target.value }))} className="w-full bg-openclaw-bg border border-openclaw-border rounded-lg px-3 py-2 text-sm text-openclaw-text font-mono" />
                  </div>
                  <div>
                    <label className="text-sm text-openclaw-text block mb-1">Supabase Key</label>
                    <input type="password" value={settings.supabaseKey} onChange={e => setSettings(s => ({ ...s, supabaseKey: e.target.value }))} placeholder="••••••••••••••••" className="w-full bg-openclaw-bg border border-openclaw-border rounded-lg px-3 py-2 text-sm text-openclaw-text font-mono" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-openclaw-textMuted uppercase tracking-wider">Aparência</h3>
                <div>
                  <label className="text-sm text-openclaw-text block mb-2">Tema</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))} className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${settings.theme === 'dark' ? 'border-openclaw-primary bg-openclaw-primary/10 text-openclaw-primary' : 'border-openclaw-border text-openclaw-textMuted hover:border-openclaw-textMuted'}`}><Moon className="w-4 h-4" />Dark</button>
                    <button onClick={() => setSettings(s => ({ ...s, theme: 'light' }))} className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${settings.theme === 'light' ? 'border-openclaw-primary bg-openclaw-primary/10 text-openclaw-primary' : 'border-openclaw-border text-openclaw-textMuted hover:border-openclaw-textMuted'}`}><Sun className="w-4 h-4" />Light</button>
                  </div>
                  <p className="text-xs text-openclaw-textMuted mt-2">Tema light em breve • Por enquanto apenas dark mode</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-openclaw-textMuted uppercase tracking-wider">Notificações</h3>
                <div className="space-y-2">
                  {[
                    { key: 'agentStart', label: 'Quando agente inicia', desc: 'Notificação ao iniciar um agente' },
                    { key: 'agentComplete', label: 'Quando agente completa', desc: 'Notificação ao concluir tarefa' },
                    { key: 'errors', label: 'Erros', desc: 'Notificações de erros e falhas' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-openclaw-bg border border-openclaw-border">
                      <div><p className="text-sm text-openclaw-text font-medium">{item.label}</p><p className="text-xs text-openclaw-textMuted">{item.desc}</p></div>
                      <button onClick={() => setSettings(s => ({ ...s, notifications: { ...s.notifications, [item.key]: !s.notifications[item.key as keyof typeof s.notifications] } }))} className={`w-11 h-6 rounded-full transition-colors ${settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-openclaw-primary' : 'bg-openclaw-border'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-openclaw-border flex items-center justify-between">
          <div className="text-xs text-openclaw-textMuted">v1.0.0 • Mission Command Hub</div>
          <div className="flex items-center gap-2">
            {saved && <span className="text-sm text-openclaw-success flex items-center gap-1"><Check className="w-4 h-4" />Salvo!</span>}
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-openclaw-primary hover:bg-openclaw-primaryHover text-white transition-colors text-sm font-medium">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  )
}