-- Schema Supabase para Mission Command Hub
-- Execute este SQL no Supabase SQL Editor

-- Tabela de Agentes
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'error')),
  icon TEXT DEFAULT '🤖',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Atividades
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  agent_name TEXT,
  action TEXT NOT NULL,
  type TEXT DEFAULT 'system' CHECK (type IN ('agent', 'task', 'system', 'integration')),
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Integrações
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('ok', 'pending', 'error')),
  config JSONB DEFAULT '{}',
  last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO agents (name, description, status, icon) VALUES
  ('Research Agent', 'Pesquisas e análise de documentos', 'active', '🔍'),
  ('Code Agent', 'Desenvolvimento e revisão de código', 'active', '💻'),
  ('Writer Agent', 'Criação de conteúdo e documentação', 'idle', '✍️'),
  ('Data Agent', 'Análise de dados e métricas', 'active', '📊')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (agent_id, title, status, priority) VALUES
  ((SELECT id FROM agents WHERE name = 'Research Agent' LIMIT 1), 'Revisar文档ação', 'in_progress', 'high'),
  ((SELECT id FROM agents WHERE name = 'Code Agent' LIMIT 1), 'Implementar autenticação', 'backlog', 'high'),
  ((SELECT id FROM agents WHERE name = 'Writer Agent' LIMIT 1), 'Atualizar README', 'done', 'low')
ON CONFLICT DO NOTHING;

INSERT INTO integrations (name, type, status) VALUES
  ('OpenAI (GPT-4)', 'llm', 'ok'),
  ('Notion', 'database', 'ok'),
  ('Slack', 'messaging', 'ok'),
  ('MCP Server', 'protocol', 'pending')
ON CONFLICT DO NOTHING;

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE agents;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_agent ON tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);