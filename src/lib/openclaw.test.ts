import { describe, it, expect } from 'vitest'
import { initOpenClaw, getOpenClawConfig } from './openclaw'

describe('openclaw config', () => {
  it('should update gateway config', () => {
    initOpenClaw({ gatewayUrl: 'http://localhost:9999' })
    expect(getOpenClawConfig().gatewayUrl).toBe('http://localhost:9999')
  })

  it('should preserve config object shape', () => {
    const config = getOpenClawConfig()
    expect(config).toHaveProperty('gatewayUrl')
  })
})