# Mission Command Hub - PRD de Melhorias

## Visão Geral
Aplicativo React para controle e gerenciamento de agentes de IA com integração Supabase e OpenClaw.

---

## 1. Melhorias de Layout

### 1.1 Sidebar
- [x] Logo com gradiente e efeito glow
- [x] Chat integrado com input e mensagens
- [x] Navegação colapsável
- [x] Itens com highlight em primary color
- [ ] Adicionar avatares dos agentes
- [ ] Indicador de status online

### 1.2 Header
- [x] Barra de status simples
- [x] Status Supabase (indicador de conexão)
- [ ] Notifications dropdown
- [ ] User menu dropdown
- [ ] Busca global (Cmd+K)

### 1.3 Painel de Agentes
- [x] Cards com emojis e status
- [x] Detail view com capacidades
- [x] Atividade recente
- [ ] Histórico de tarefas
- [ ] Logs em tempo real

### 1.4 Activity Feed
- [x] Lista de atividades
- [x] Ícones por tipo
- [ ] Filtros por tipo
- [ ] Busca por data

### 1.5 Integrações
- [x] Cards com status
- [x] Validação visual
- [ ] Config inline
- [ ] Logs de conexão

---

## 2. Funcionalidades

### 2.1 Autenticação Supabase
- [ ] Login/Logout
- [ ] Session management
- [ ] Protected routes

### 2.2 Banco de Dados Supabase
- [x] Cliente configurado
- [x] Schema SQL pronto
- [x] Tipos TypeScript definidos
- [ ] Hooks React para CRUD

### 2.3 Integração OpenClaw
- [x] Cliente Gateway
- [x] Listar agentes
- [x] Executar comandos
- [ ] Receber eventos realtime

### 2.4 Chat Agent
- [x] Interface de chat na sidebar
- [ ] Histórico de conversas (banco)
- [ ] Integração com LLM
- [ ] Context awareness

### 2.5 Kanban
- [x] Colunas: Backlog, In Progress, Review, Done
- [ ] Drag & drop
- [ ] Criar/editar tarefas
- [ ] Assign to agent

### 2.6 Monitor
- [x] Stats em tempo real
- [x] Status dos agentes
- [x] Controle Start/Stop (UI)
- [ ] Logs de execução

---

## 3. Integrações Externas

### 3.1 Supabase
- [x] Cliente JS configurado
- [x] Schema de banco pronto
- [ ] Auth de usuários
- [ ] Realtime subscriptions

### 3.2 OpenClaw
- [x] Gateway API client
- [x] Agent management
- [x] Command execution

### 3.3 OpenAI/Anthropic
- [ ] Chat responses
- [ ] Agent prompts

---

## 4. Stack Técnica

- [x] React 18 + TypeScript
- [x] Vite + Tailwind CSS
- [x] Supabase JS Client
- [x] Framer Motion (animações)
- [x] Lucide React (ícones)
- [ ] React Query (data fetching)

---

## 5. Prioridades

### P0 (Crítico) ✅
1. [x] Setup Supabase client
2. [x] Database schema
3. [ ] Auth básico

### P1 (Alta)
1. [x] Listar agentes (dados mock)
2. [ ] Criar/editar agentes
3. [ ] Activity feed do banco

### P2 (Média)
1. [x] Integração OpenClaw (client)
2. [x] Chat com respostas simuladas
3. [ ] Kanban funcional

### P3 (Baixa)
1. [ ] Notifications
2. [ ] Busca global
3. [ ] Relatórios

---

## 6. Arquivos do Projeto

```
mission-command-hub-openclaw/
├── src/
│   ├── components/
│   │   ├── ActivityFeed.tsx
│   │   ├── AgentPanel.tsx
│   │   ├── IntegrationCards.tsx
│   │   ├── Sidebar.tsx
│   │   └── SupabaseStatus.tsx
│   ├── hooks/
│   │   └── useSupabase.ts
│   ├── lib/
│   │   ├── openclaw.ts
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase-schema.sql
├── PRD.md
└── README.md
```

---

## 7. Como Executar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:5179

### Setup Supabase

1. Crie projeto em https://supabase.com
2. Copie o conteúdo de `supabase-schema.sql`
3. Execute no SQL Editor do Supabase
4. Configure as credenciais em `src/lib/supabase.ts`