# Mission Command Hub

Dashboard para controle e gerenciamento de agentes de IA com integração Supabase e OpenClaw.

## 🚀 Funcionalidades

- **Gerenciamento de Agentes** - Liste, monitore e controle agentes de IA
- **Task Board Kanban** - Organize tarefas em colunas (Backlog, In Progress, Review, Done)
- **Integrações** - Conecte com OpenAI, Notion, Slack, MCP Server
- **Chat Agent** - Interface de chat integrada na sidebar
- **Monitoramento** - Stats em tempo real e status dos agentes
- **Feed de Atividades** - Histórico de ações do sistema
- **Integração Supabase** - Banco de dados PostgreSQL com Realtime
- **Integração OpenClaw** - Gateway de controle de agentes

## 🛠️ Stack Técnica

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase JS Client
- OpenClaw Gateway

## 📦 Instalação

```bash
npm install
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_OPENCLAW_GATEWAY_URL=http://localhost:11434
```

### Setup Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o schema SQL em `supabase-schema.sql` no SQL Editor
3. Configure as variáveis de ambiente

## 🏃‍♂️ Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5179

## 📋 PRD

Veja o arquivo `PRD.md` para o roadmap completo de funcionalidades.

## 📄 License

MIT