# Plano de Implementação — CRM + IA + Fonte Única de Dados
**Projeto:** Sistema Comercial Saúde Prime
**Criado em:** 2026-06-09
**Status atual:** Etapa 0 — planejamento concluído, nenhuma etapa iniciada

---

## Contexto da decisão

O sistema atual tem **4 fontes de dados simultâneas** que precisam ser consolidadas em uma só (o banco PostgreSQL/SQLite). Em paralelo, serão implementados um módulo CRM e um assistente de IA (Claude API) para os corretores.

### Fontes de dados atuais (problema a resolver)
| Fonte | O que guarda | Problema |
|---|---|---|
| `dados.js` | Catálogo de operadoras, planos e preços | Hardcoded, duplicado com o banco |
| Banco (PostgreSQL/SQLite) | Tudo que deveria ser fonte única | `cotacoes` nunca recebe dados do cotador |
| `localStorage` | Histórico de cotações (máx. 20) + temas | Preso no dispositivo, sem sync |
| `sessionStorage` | JWT token + role + nome | Correto — não muda |

### Princípio que guia o plano
Cada etapa é **aditiva**: entrega valor sem remover funcionalidade existente. O sistema hospedado nunca fica em estado quebrado.

---

## Etapa 1 — Dual-write do histórico
**Risco: zero | Duração estimada: 1–2 dias**

### O que implementar
- Em `cotador-planos-saude.html`, a função `saveToHistory()` passa a chamar `POST /api/cotacoes` após gravar no localStorage
- O token JWT é obtido via `window.parent.token()` (padrão já usado no cotador para `doLogout` e `syncApres`)
- Se a chamada à API falhar, captura silenciosamente — localStorage já salvou, corretor não percebe nada

### Resultado
- O comportamento do corretor não muda absolutamente nada
- O banco começa a receber cotações reais em produção
- Nenhuma UI é alterada

### Critério para avançar para Etapa 2
Após 2–3 dias em produção, verificar no banco se as cotações estão chegando com dados corretos.

---

## Etapa 2 — Estrutura de dados do CRM
**Risco: zero | Duração estimada: 2–3 dias**

### Novas tabelas no banco
Adicionadas via `init_db()` com `CREATE TABLE IF NOT EXISTS` — aplicadas automaticamente no próximo deploy sem risco.

```sql
-- Clientes gerenciados pelos corretores
CREATE TABLE clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    empresa TEXT,
    cnpj TEXT,
    telefone TEXT,
    email TEXT,
    n_vidas_estimado INTEGER,
    segmento TEXT,          -- 'pme' | 'pf' | 'senior'
    origem TEXT,            -- 'indicacao' | 'site' | 'ads' | 'outro'
    corretor_id INTEGER REFERENCES users(id),
    corretora_id INTEGER REFERENCES corretoras(id),
    ativo INTEGER DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Funil de vendas por cliente
CREATE TABLE oportunidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    estagio TEXT DEFAULT 'lead',  -- 'lead'|'contato'|'proposta'|'negociacao'|'fechado'|'perdido'
    valor_estimado REAL,
    data_prevista_fechamento TEXT,
    motivo_perda TEXT,
    obs TEXT,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Linha do tempo de interações com o cliente
CREATE TABLE interacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,   -- 'ligacao'|'whatsapp'|'email'|'reuniao'|'nota'
    descricao TEXT,
    usuario TEXT REFERENCES users(username),
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Alteração backward-compatible na tabela `cotacoes`
```sql
-- Migration segura: coluna nullable, cotações antigas ficam com NULL
ALTER TABLE cotacoes ADD COLUMN cliente_id INTEGER REFERENCES clientes(id);
```

### Novos endpoints da API (todos sob `require_corretor`)
```
GET    /api/clientes                         → lista clientes do corretor
POST   /api/clientes                         → cria cliente
GET    /api/clientes/{id}                    → ficha completa
PATCH  /api/clientes/{id}                    → edita cliente
DELETE /api/clientes/{id}                    → desativa cliente

GET    /api/clientes/{id}/oportunidades      → oportunidades do cliente
POST   /api/clientes/{id}/oportunidades      → cria oportunidade
PATCH  /api/oportunidades/{id}               → avança estágio / edita

GET    /api/clientes/{id}/interacoes         → linha do tempo
POST   /api/clientes/{id}/interacoes         → registra interação
DELETE /api/interacoes/{id}                  → remove interação

GET    /api/clientes/{id}/cotacoes           → cotações do banco vinculadas ao cliente
```

### Critério para avançar para Etapa 3
Testar todos os endpoints localmente com dados reais antes de fazer deploy.

---

## Etapa 3 — Interface CRM para o corretor
**Risco: baixo | Duração estimada: 4–6 dias**

Nova aba "Clientes" no `sistema-saude-prime.html`. O cotador e a apresentação continuam funcionando exatamente como antes.

### Tela de lista de clientes
- Tabela/cards com nome, empresa, estágio da oportunidade, data da última interação
- Busca por nome ou empresa
- Filtro por estágio do funil
- Botão "Novo cliente"

### Ficha do cliente
- Dados de contato editáveis inline
- Estágio atual com botão para avançar no funil
- Linha do tempo de interações em ordem cronológica
- Campo para adicionar nova interação (tipo + descrição)
- Lista de cotações associadas (com botão para restaurar no cotador)

### Integração com o cotador
- Campo de busca de cliente antes de iniciar uma cotação (opcional — pode cotar sem vincular)
- Ao salvar histórico (Etapa 1), se cliente selecionado, `cliente_id` é enviado junto
- Botão "Ver no CRM" no modal de histórico que abre a ficha do cliente

### Critério para avançar para Etapa 4
Um corretor usar o CRM em produção por pelo menos uma semana e confirmar que o fluxo faz sentido na prática.

---

## Etapa 4 — Migração completa para fonte única
**Risco: baixo, mas exige validação prévia | Duração estimada: 1–2 dias**
**Pré-requisito:** Etapas 1 e 2 estáveis em produção por pelo menos 2 semanas.

### 4a — Migrar leitura do histórico
- `loadHistory()` passa a chamar `GET /api/cotacoes` em vez do localStorage
- Modal de histórico mostra dados do banco — sem limite de 20 cotações
- localStorage continua sendo escrito em paralelo por mais algum tempo como segurança

### 4b — Remover fallback do `dados.js`
- `_initCotador()` para de usar `window.SP_DATA` como fallback
- Se `/api/catalogo` falhar, exibe mensagem de erro em vez de dados potencialmente desatualizados
- `dados.js` vira apenas documentação de referência dos dados iniciais

### 4c — Limpar localStorage do histórico
- Remover `sp_historico_cotacoes` do localStorage
- Manter `cot_theme` e `adm_theme` (preferências visuais — correto ficar local)

### Critério para avançar para Etapa 5
Banco sem incidentes em produção por 2+ semanas.

---

## Etapa 5 — IA: assistente contextual no cotador
**Risco: zero em produção | Duração estimada: 2–3 dias**
**Pré-requisito:** chave ANTHROPIC_API_KEY configurada no Railway.

### Dependência nova
```
# requirements.txt
anthropic>=0.40.0
```

### Variável de ambiente
```
ANTHROPIC_API_KEY=sk-ant-...   → adicionar no Railway
```

### Novo endpoint
```
POST /api/ai/chat
  Authorization: Bearer <token>
  body: { mensagem: str, contexto_cotacao: dict, historico: list }
  → chama Claude API → retorna { resposta: str }
```

### Implementação do endpoint
```python
import anthropic

@app.post("/api/ai/chat")
def ai_chat(body: AIChatRequest, user=Depends(require_corretor)):
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    system = """Você é um assistente especializado em planos de saúde coletivos,
auxiliando corretores da Saúde Prime Seguros e Saúde (Brasília/DF).
Conhece as operadoras Unity, Evo, Plenum, Amil, MedSênior, Seguros Unimed,
Porto Saúde, Bradesco, Best Sênior e SulAmérica.
Responda de forma direta e profissional. Use os dados da cotação quando relevante.
Nunca invente valores — use apenas os dados fornecidos no contexto."""

    # Contexto da cotação atual (injetado automaticamente pelo frontend)
    contexto = f"""
Cotação em andamento:
- Cliente: {body.contexto_cotacao.get('nome', 'não informado')}
- Total de vidas: {body.contexto_cotacao.get('totalVidas', 0)}
- Operadora mais barata: {body.contexto_cotacao.get('winner', 'nenhuma')}
- Valor mensal: R$ {body.contexto_cotacao.get('winnerTotal', 0):.2f}
- Planos comparados: {body.contexto_cotacao.get('planosResumo', [])}
"""

    messages = body.historico + [
        {"role": "user", "content": f"{contexto}\n\n{body.mensagem}"}
    ]

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=[{"type": "text", "text": system,
                 "cache_control": {"type": "ephemeral"}}],  # prompt caching
        messages=messages,
    )

    return {"resposta": response.content[0].text}
```

### Interface no cotador
- Botão "✦ IA" flutuante no canto inferior direito do cotador
- Painel lateral deslizante com histórico da conversa na sessão
- Campo de input + botão enviar
- Sugestões rápidas de perguntas:
  - "Compare os planos desta cotação"
  - "Qual o melhor argumento para este cliente?"
  - "Explique coparticipação em linguagem simples"
  - "Gere uma mensagem de WhatsApp com o estudo"
- Histórico da conversa fica em memória (não persiste no banco nesta etapa)

### Custo estimado (com prompt caching ativo)
- Por interação: ~R$ 0,05–0,20
- 10 corretores × 20 consultas/dia: ~R$ 60–120/mês

### Critério para avançar para Etapa 6
Corretores usando a IA e dando retorno sobre a utilidade das respostas.

---

## Etapa 6 — IA com contexto do CRM
**Risco: zero | Duração estimada: 3–4 dias**
**Pré-requisito:** Etapas 3 (CRM) e 5 (IA básica) completas.

### O que muda no contexto enviado ao Claude
```python
historico_cliente = f"""
Histórico do cliente {cliente.nome}:
- {len(cotacoes)} cotações registradas
- Última proposta: {ultima_op} — R$ {ultimo_valor:.2f}/mês ({ultima_data})
- Interações: {resumo_interacoes}
- Estágio atual no funil: {oportunidade.estagio}
"""
```

### Novas capacidades do assistente
- Análise do histórico: "Por que esse cliente ainda não fechou?"
- Geração de follow-up personalizado com nome e última proposta
- Priorização: "Quais clientes devo contatar hoje?"

### Tool use do Claude (ações reais)
```python
tools = [
    {
        "name": "buscar_cliente",
        "description": "Busca dados e histórico completo de um cliente pelo nome",
        "input_schema": {
            "type": "object",
            "properties": {"nome": {"type": "string"}},
            "required": ["nome"]
        }
    },
    {
        "name": "listar_pipeline",
        "description": "Lista clientes por estágio do funil de vendas",
        "input_schema": {
            "type": "object",
            "properties": {
                "estagio": {
                    "type": "string",
                    "enum": ["lead", "contato", "proposta", "negociacao", "fechado", "perdido"]
                }
            }
        }
    }
]
```

---

## Sequência visual

```
HOJE
  │
  ▼
[Etapa 1] Dual-write histórico ............. 1–2 dias   ← pode começar amanhã
  │
  ▼
[Etapa 2] Tabelas + API do CRM ............. 2–3 dias
  │
  ▼
[Etapa 3] Interface CRM para corretor ...... 4–6 dias
  │
  ├──────────────────────────────────┐
  ▼                                  ▼
[Etapa 4] Migração fonte única ..... 1–2 dias   [Etapa 5] IA contextual (cotação) ... 2–3 dias
  │                                  │
  └──────────────┬───────────────────┘
                 ▼
         [Etapa 6] IA com contexto CRM .... 3–4 dias

SISTEMA COMPLETO
```

---

## Decisões pendentes antes da Etapa 5

1. **Custo da IA:** definir se o custo da API Claude (~R$ 60–150/mês) será incluído no plano das corretoras ou gerenciado centralmente
2. **Modelo Claude:** `claude-sonnet-4-6` é o recomendado (equilíbrio custo/qualidade). `claude-haiku-4-5-20251001` é mais barato para consultas simples
3. **Limite de uso por corretora:** considerar rate limiting no endpoint `/api/ai/chat` para evitar custos inesperados
