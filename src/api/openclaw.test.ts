import { describe, it, expect } from 'vitest'
import { openclawApi } from './openclaw'

describe('openclaw api client', () => {
  it('should expose expected methods', () => {
    expect(typeof openclawApi.checkConnection).toBe('function')
    expect(typeof openclawApi.getStatus).toBe('function')
    expect(typeof openclawApi.getAgents).toBe('function')
    expect(typeof openclawApi.executeAgent).toBe('function')
    expect(typeof openclawApi.sendChatMessage).toBe('function')
  })
})