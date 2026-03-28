import { useState, useCallback, useEffect } from 'react'
import { openclawApi } from '../api/openclaw'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  agent?: string
}

const STORAGE_KEY = 'openclaw-chat-history'

function loadFromStorage(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((m: ChatMessage) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    }
  } catch (e) {
    console.warn('Failed to load chat history:', e)
  }
  return []
}

function saveToStorage(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)))
  } catch (e) {
    console.warn('Failed to save chat history:', e)
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadFromStorage())
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  // Check connection on mount
  useEffect(() => {
    openclawApi.checkConnection().then(setConnected)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    saveToStorage(messages)
  }, [messages])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await openclawApi.sendChatMessage(content)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        agent: response.agent
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, houve um erro ao processar sua mensagem.',
        timestamp: new Date(),
        agent: 'system'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearHistory = useCallback(() => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    messages,
    loading,
    connected,
    sendMessage,
    clearHistory
  }
}