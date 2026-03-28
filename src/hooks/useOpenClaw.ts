import { useState, useEffect, useCallback } from 'react'
import { openclawApi, OpenClawStatus, OpenClawAgent } from '../api/openclaw'

export function useOpenClaw() {
  const [status, setStatus] = useState<OpenClawStatus>({
    connected: false,
    uptime: '--',
    version: '1.0.0',
    memory: 0
  })
  const [agents, setAgents] = useState<OpenClawAgent[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [connected, statusData, agentsData] = await Promise.all([
        openclawApi.checkConnection(),
        openclawApi.getStatus(),
        openclawApi.getAgents()
      ])
      
      setStatus({ ...statusData, connected })
      setAgents(agentsData)
    } catch (error) {
      console.error('Failed to refresh OpenClaw status:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    // Refresh every 30 seconds
    const interval = setInterval(refresh, 30000)
    return () => clearInterval(interval)
  }, [refresh])

  const executeAgent = useCallback(async (agentId: string, command: string) => {
    const result = await openclawApi.executeAgent(agentId, command)
    if (result.success) {
      await refresh()
    }
    return result
  }, [refresh])

  return {
    status,
    agents,
    loading,
    refresh,
    executeAgent
  }
}