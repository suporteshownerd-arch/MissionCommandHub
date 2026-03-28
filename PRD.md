# PRD - Mission Command Hub
## Plano de Melhorias Contínuas

---

## 1. Visão Geral

**Projeto:** Mission Command Hub (OpenClaw Control UI)  
**Stack:** React + Vite + TypeScript + TailwindCSS  
**Versão atual:** 1.0.0

### Objetivos
- Interface unificada para controle de agentes IA
- Integração com OpenClaw Gateway e MCP
- Framework de skills estruturado

---

## 2. Análise do Estado Atual

### ✅ Pontos Fortes
- UI moderna com dark theme e animações
- Sidebar expansível com chat integrado
- Framework de skills documentado
- Componentes bem estruturados

### ⚠️ Áreas de Melhoria

| Área | Problema | Prioridade |
|------|----------|------------|
| **FrameworkOverview** | Dados estáticos hardcoded | Alta |
| **Chat Agent** | Mock apenas (sem integração real) | Alta |
| **MCP Panel** | Dados mockados, sem API real | Alta |
| **Settings** | Botão sem funcionalidade | Média |
| **TypeScript** | Algunos tipos `any` | Média |
| **Performance** | Bundle 512KB (sem code-splitting) | Baixa |
| **Kanban/Monitor** | Views placeholder | Baixa |

---

## 3. Roadmap de Melhorias

### Fase 1: Funcionalidades Core (Próxima sprint)

#### 3.1 Dashboard com dados reais
- [ ] Conectar Dashboard ao OpenClaw Gateway
- [ ] Mostrar status real dos agentes
- [ ] Exibir uptime real da API

#### 3.2 Framework dinâmico
- [ ] Ler arquivos do `Skills/official/` via API
- [ ] Exibir skills carregadas dinamicamente
- [ ] Mostrar Quick Routing interativo

#### 3.3 Chat Agent funcional
- [ ] Conectar ao endpoint do OpenClaw
- [ ] Suporte a streaming de respostas
- [ ] Histórico persistido localStorage

### Fase 2: Integração (Próximas 2 sprints)

#### 3.4 MCP real
- [ ] Integrar com `/api/mcp/tools`
- [ ] Integrar com `/api/mcp/agents`
- [ ] Execução real de ferramentas

#### 3.5 Settings completo
- [ ] Configurações de tema
- [ ] Configurações de API
- [ ] Preferências do usuário

### Fase 3: Otimização

#### 3.6 Performance
- [ ] Lazy loading de rotas
- [ ] Code splitting
- [ ] Otimização de bundle

---

## 4. Implementações Concluídas (v1.1)

### ✅ Fase 1 - Concluído
- [x] API Client (`src/api/openclaw.ts`)
- [x] Hooks: `useOpenClaw`, `useSkills`, `useChat`
- [x] FrameworkOverview dinâmico com 14 skills
- [x] Chat com localStorage e streaming simulation
- [x] Dashboard com dados reais do Gateway

### ✅ Fase 2 - Concluído
- [x] Settings completo (modal com abas)
- [x] Kanban interativo (CRUD completo)
- [x] Monitor melhorado com dados reais
- [x] Sidebar melhorada

---

## 5. Especificação Técnica

### 5.1 Estrutura de arquivos atual

```
src/
├── api/
│   └── openclaw.ts      # Client API ✓
├── components/
│   ├── Settings.tsx    # Modal de configurações ✓
│   ├── KanbanView.tsx   # Task board ✓
│   ├── MonitorView.tsx  # Monitor ✓
│   └── FrameworkOverview.tsx # Skills dinâmicas ✓
├── hooks/
│   ├── useOpenClaw.ts  ✓
│   ├── useSkills.ts    ✓
│   └── useChat.ts      ✓
└── App.tsx              # Organizado
```

### 5.2 Endpoints suportados

```typescript
// OpenClaw Gateway
GET  /health            → Connection check
GET  /api/status        → System status
GET  /api/agents        → Agent[]
POST /api/agents/:id/execute
POST /api/chat          → Chat response
```

---

## 6. Próximas Melhorias (Backlog)

### Alta Prioridade
- [ ] Integração MCP real com ferramentas
- [ ] Theme light mode
- [ ] Notificações toast

### Média Prioridade
- [ ] Code splitting / lazy loading
- [ ] Testes unitários
- [ ] Keyboard shortcuts

### Baixa Prioridade
- [ ] PWA support
- [ ] Analytics
- [ ] Temas customizáveis

---

## 7. Métricas de Sucesso

- [ ] Build < 300KB (gzipped)
- [ ] Lighthouse Performance > 80
- [ ] Tempo de resposta API < 500ms
- [ ] Cobertura de testes > 60%

---

*Documento vivo - atualizar conforme evolução*