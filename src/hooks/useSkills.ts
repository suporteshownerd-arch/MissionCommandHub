import { useState, useEffect, useCallback } from 'react'

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  color?: string
  prompts?: {
    default?: string
    research?: string
    code?: string
    review?: string
  }
  references?: string[]
  commands?: string[]
}

// Static skills from the official folder (for now loaded statically)
const staticSkills: Skill[] = [
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Pesquisa, análise de dados e documentos',
    category: 'research',
    color: '#14b8a6',
    commands: ['research', 'analyze', 'report']
  },
  {
    id: 'pm',
    name: 'Project Manager',
    description: 'Gerenciamento de projetos e coordenação',
    category: 'management',
    color: '#8b5cf6',
    commands: ['plan', 'track', 'milestone']
  },
  {
    id: 'po',
    name: 'Product Owner',
    description: 'Priorização e definição de requisitos',
    category: 'product',
    color: '#f59e0b',
    commands: ['backlog', 'priority', 'feature']
  },
  {
    id: 'sm',
    name: 'Scrum Master',
    description: 'Facilitação de sprints e reuniões',
    category: 'agile',
    color: '#ec4899',
    commands: ['sprint', 'retro', 'standup']
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Design de sistemas e decisões técnicas',
    category: 'technical',
    color: '#6366f1',
    commands: ['design', 'architecture', 'decision']
  },
  {
    id: 'dev',
    name: 'Developer',
    description: 'Implementação e código',
    category: 'development',
    color: '#10b981',
    commands: ['code', 'implement', 'fix']
  },
  {
    id: 'qa',
    name: 'QA Engineer',
    description: 'Testes e qualidade',
    category: 'quality',
    color: '#ef4444',
    commands: ['test', 'verify', 'bug']
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Infraestrutura e deployment',
    category: 'operations',
    color: '#0ea5e9',
    commands: ['deploy', 'ci/cd', 'infra']
  },
  {
    id: 'ux-design-expert',
    name: 'UX Designer',
    description: 'Experiência do usuário e UI/UX',
    category: 'design',
    color: '#d946ef',
    commands: ['ui', 'ux', 'prototype']
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    description: 'Pipelines de dados e ETL',
    category: 'data',
    color: '#f97316',
    commands: ['pipeline', 'etl', 'transform']
  },
  {
    id: 'meeting-analyst',
    name: 'Meeting Analyst',
    description: 'Análise de reuniões e atas',
    category: 'collaboration',
    color: '#84cc16',
    commands: ['minutes', 'summary', 'action-items']
  },
  {
    id: 'aiox-master',
    name: 'AIOx Master',
    description: 'Coordenação entre múltiplos agentes',
    category: 'coordination',
    color: '#ff5c5c',
    commands: ['orchestrate', 'coordinate', 'multi-agent']
  },
  {
    id: 'squad-creator',
    name: 'Squad Creator',
    description: 'Criação de squads e equipes',
    category: 'team',
    color: '#06b6d4',
    commands: ['squad', 'team', 'assign']
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ponto de partida para novos projetos',
    category: 'onboarding',
    color: '#a855f7',
    commands: ['init', 'scaffold', 'boilerplate']
  }
]

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(staticSkills)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Try to fetch from API (future enhancement)
      // For now, we use the static skills
      setSkills(staticSkills)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getSkillById = useCallback((id: string) => {
    return skills.find(s => s.id === id)
  }, [skills])

  const getSkillsByCategory = useCallback((category: string) => {
    return skills.filter(s => s.category === category)
  }, [skills])

  return {
    skills,
    loading,
    error,
    refresh,
    getSkillById,
    getSkillsByCategory
  }
}