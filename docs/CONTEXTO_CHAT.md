# Contexto para novo chat — Sistema Comercial Saúde Prime

> Cole este arquivo inteiro no início de um novo chat para retomar o trabalho sem perda de contexto.

---

## Quem sou eu e o que estamos construindo

Sou o dono/gestor da **Saúde Prime Seguros e Saúde**, corretora de planos de saúde em Brasília/DF. Estamos evoluindo um sistema comercial interno — cotador de planos + painel administrativo — para incluir um **módulo CRM** e um **assistente de IA** para corretores.

O sistema já está **hospedado e funcionando em produção** no Railway. Qualquer mudança deve ser feita de forma segura, sem quebrar o que já funciona.

---

## Stack do projeto

```
Raiz: CotadorSaúdePrime/
├── app/
│   ├── cotador-planos-saude.html   ← cotador interativo (HTML + JS vanilla)
│   ├── apresentacao-executiva.html ← gerador de apresentações comerciais
│   ├── sistema-saude-prime.html    ← painel admin + login + iframe do cotador
│   └── dados.js                    ← catálogo de planos (fallback estático)
├── backend/
│   ├── main.py       ← FastAPI, todas as rotas (1242 linhas)
│   ├── auth.py       ← JWT + bcrypt
│   ├── database.py   ← abstração SQLite/PostgreSQL, migrations
│   └── requirements.txt
├── landing/          ← site institucional Next.js (independente)
├── railway.json      ← deploy automático no Railway
└── docs/
    ├── PLANO_IMPLEMENTACAO.md  ← plano detalhado de todas as etapas
    └── CONTEXTO_CHAT.md        ← este arquivo
```

---

## Como o sistema funciona hoje

### Autenticação
- Login via `POST /api/login` → JWT armazenado em `sessionStorage`
- Três roles: `superadmin` / `admin` / `corretor`
- Apenas admins criam contas de corretores
- O cotador **não tem acesso direto** — vive dentro de um `<iframe>` no `sistema-saude-prime.html`, que só exibe o iframe após login bem-sucedido com role `corretor`
- O cotador acessa o token do pai via `window.parent.token()`

### Armazenamento de dados — PROBLEMA ATUAL
Existem 4 fontes simultâneas que precisam ser consolidadas em uma:

| Fonte | O que guarda | Status |
|---|---|---|
| `dados.js` | Catálogo de planos (hardcoded) | Duplicado com o banco — problema |
| Banco (PostgreSQL/SQLite) | Deveria ser fonte única | Tabela `cotacoes` nunca recebe dados do cotador |
| `localStorage` | Histórico de cotações (máx. 20) + temas | Histórico preso no dispositivo |
| `sessionStorage` | JWT + role + nome | Correto — não muda |

### Tabelas existentes no banco
`corretoras` · `users` · `cotacoes` · `audit_log` · `operadoras` · `planos` · `rede_credenciada`

### Como o cotador carrega o catálogo
1. Carrega `dados.js` como `<script>` → popula `window.SP_DATA`
2. Chama `GET /api/catalogo` (público, sem auth)
3. Se banco tiver dados válidos → sobrescreve `dados.js` por operadora
4. Se banco vazio/offline → usa `dados.js` como fallback

---

## O que já foi decidido e planejado

### Objetivo final
- **Fonte única de dados:** tudo no banco. `dados.js` vira só referência estática
- **CRM integrado:** clientes, funil de vendas, interações, cotações vinculadas
- **IA assistente:** Claude API com contexto da cotação e histórico do CRM

### Plano completo (detalhes em `docs/PLANO_IMPLEMENTACAO.md`)

**Etapa 1 — Dual-write do histórico** ← PRÓXIMA A IMPLEMENTAR
- `saveToHistory()` salva em localStorage (como hoje) E chama `POST /api/cotacoes`
- Risco zero. Cotador continua idêntico para o corretor
- Token obtido via `window.parent.token()`

**Etapa 2 — Estrutura de dados do CRM**
- Novas tabelas: `clientes`, `oportunidades`, `interacoes`
- Coluna `cliente_id` (nullable) adicionada em `cotacoes`
- Novos endpoints REST para todo o CRUD

**Etapa 3 — Interface CRM para o corretor**
- Nova aba "Clientes" no `sistema-saude-prime.html`
- Lista de clientes, ficha com linha do tempo, integração com cotador

**Etapa 4 — Migração fonte única**
- `loadHistory()` passa a ler do banco
- Remove fallback `dados.js` no cotador
- Remove `localStorage[sp_historico_cotacoes]`

**Etapa 5 — IA: assistente contextual**
- `POST /api/ai/chat` no backend usando `anthropic` SDK
- Contexto automático: dados da cotação em andamento
- Painel de chat lateral no cotador
- `ANTHROPIC_API_KEY` como variável de ambiente no Railway
- Modelo recomendado: `claude-sonnet-4-6` com prompt caching

**Etapa 6 — IA com contexto do CRM**
- Assistente passa a conhecer histórico do cliente
- Tool use do Claude para consultar CRM em tempo real

---

## Regras de desenvolvimento

- **Sempre git add + commit + push ao final de toda modificação** (deploy automático no Railway)
- Mudanças devem ser aditivas — nunca remover funcionalidade existente antes da substituta estar estável em produção
- O banco usa `CREATE TABLE IF NOT EXISTS` e migrations safe (try/except por statement)
- `dados.js` tem fallback ativo no cotador — não remover antes da Etapa 4

---

## Onde estamos agora

**Status:** Etapa 3 concluída (2026-06-10). Hapvida no banco, colunas renomeadas, refatorações de código.

**Próxima ação:** implementar a Etapa 3 (interface) — aba "Clientes" CRM no `sistema-saude-prime.html`.

**O que foi feito na Etapa 1 (2026-06-09):**
- `app/cotador-planos-saude.html` — `saveToHistory()` agora chama `POST /api/cotacoes` via `window.parent.token()` após gravar no localStorage. Fire-and-forget, sem impacto no corretor.

**O que foi feito na Etapa 2 (2026-06-10):**
- `backend/database.py` — tabelas `clientes`, `oportunidades`, `interacoes` nos blocos PG e SQLite; migrations para `atualizado_em` (7 tabelas), `cotacoes.cliente_id`, `cotacoes.usuario_id`, `audit_log.usuario_id`, 6 índices, remoção de CASCADE de `users → corretoras`
- `backend/main.py` — 12 endpoints CRM: CRUD de clientes, oportunidades, interações e listagem de cotações por cliente (todos sob `require_corretor` com controle de acesso por role)

**O que foi feito na Etapa 3 — parte técnica (2026-06-10):**
- `backend/database.py` — DDL de `planos` usa `acomodacao`, `faixa_vidas`, `moderador`, `mes_vigencia`; migrations `RENAME COLUMN` (PG) e `INSERT OR IGNORE` (SQLite); seed Hapvida com 10 planos
- `backend/main.py` — `importar_catalogo`, `criar_plano`, `atualizar_plano`, `catalogo_publico` atualizados para novos nomes de coluna; Hapvida adicionado ao `seed_catalogo()`
- `app/cotador-planos-saude.html` — `OP_CLS_MAP`, `subCls`, `subAttr`, `tbCls` extraídos de dentro de funções para escopo de módulo
- `app/apresentacao-executiva.html` + `app/sistema-saude-prime.html` — `alert()` substituídos por `showToast()` (toast CSS + função adicionados)

---

## Identidade visual do projeto
- **Cores:** Navy `#0f2340` · Gold `#c9a227` · Cream `#faf9f6`
- **Tipografia:** Cormorant Garamond (títulos) + DM Sans (corpo)
- Qualquer nova UI deve seguir o padrão visual existente
