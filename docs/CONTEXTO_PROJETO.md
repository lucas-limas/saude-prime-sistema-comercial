# 🏥 Projeto: Sistema Comercial — Saúde Prime Seguros e Saúde
**Arquivo de contexto para Claude Code**
Última atualização: Mai/2026

---

## 1. SOBRE A EMPRESA

**Saúde Prime Seguros e Saúde** é uma corretora de planos de saúde localizada em **Brasília/DF**, especializada em planos coletivos por adesão e PME. O usuário do sistema é o corretor/gestor da corretora.

- **Logo:** arquivo `Logo_Saude_Prime__1_.png` (JPEG embutido em base64 nos HTMLs — mime: `image/jpeg`, apesar da extensão `.png`)
- **Identidade visual:** Navy `#0f2340`, Gold `#c9a227`, Cream `#faf9f6`
- **Tipografia:** Cormorant Garamond (títulos/valores) + DM Sans (corpo)

---

## 2. ARQUIVOS DO PROJETO

```
CotadorSaúdePrime/
├── CONTEXTO_PROJETO.md          ← este arquivo
├── cotador-planos-saude.html    ← cotador comparativo interativo
├── apresentacao-executiva.html  ← gerador de apresentação GPCT+SPIN
└── saude_prime_operadoras.json  ← base de dados JSON de todas as operadoras
```

---

## 3. ARQUIVO: `cotador-planos-saude.html`

### O que é
Cotador comparativo de planos de saúde. Arquivo HTML standalone (funciona offline, sem servidor). O corretor abre no navegador e usa internamente para calcular preços antes de apresentar ao cliente.

### Funcionalidades
- **3 abas:** Cotação | Rede Credenciada | Carências
- **Aba Cotação:**
  - Sidebar esquerda: nome do cliente, observações, faixas etárias com botões +/− por faixa (10 faixas, 0-18 a 59+), seletor de plano independente por operadora
  - Área direita: tabela de resultado mostrando **apenas faixas com vidas > 0**, preço por vida, subtotal por operadora, marcador ✓ verde na linha mais barata, blocos de total por operadora, destaque da vencedora
  - Modal "Enviar estudo": gera links mailto: e wa.me/ com mensagem pré-preenchida
- **Aba Rede Credenciada:** cards por operadora com hospitais, tags PS/INT/AMB/MAT, laboratórios, diferenciais
- **Aba Carências:** tabela comparativa por operadora, sidebar com critérios de redução (ARC/RC), limites de coparticipação

### Operadoras no cotador (4 de ~10 previstas)
| Operadora | Cor CSS | Produtos |
|-----------|---------|----------|
| Unity Saúde | `--unity: #0f2340` | 6 planos (AMB/ENF/APT × sem/com copart) |
| Evo Saúde | `--evo: #5c1a40` | 6 planos (ENF/APT × sem/ONE/NOW) |
| Plenum Saúde | `--plenum: #0a4028` | 8 planos (ENF/APT × parcial/total × Delta/Ômega/Beta/Sigma) |
| Amil | `--amil: #d4000f` | 20 planos (Bronze/Prata/Ouro/Platinum × QC/QP × total/parcial) |

### Estrutura JS principal
```javascript
// Array flat de todos os planos
const PLANOS = [
  {id:'u1', op:'unity', nome:'Sem copart — Life Vital', aco:'amb', precos:[...]},
  // ... 40 planos total
];

// Metadados por operadora
const OP_META = {
  unity:  {nome:'Unity Saúde',  cor:'var(--unity)',  cls:'on-u', info:'...'},
  evo:    {nome:'Evo Saúde',    cor:'var(--evo)',    cls:'on-e', info:'...'},
  plenum: {nome:'Plenum Saúde', cor:'var(--plenum)', cls:'on-p', info:'...'},
  amil:   {nome:'Amil',         cor:'var(--amil)',   cls:'on-a', info:'...'},
};

// Estado
let qtds = Array(10).fill(0);        // vidas por faixa etária
let selPlanos = {unity:'u3', evo:'e1', plenum:'p1', amil:'a1'}; // plano selecionado por op
```

### Como adicionar nova operadora
1. Adicionar entradas no array `PLANOS` com `op:'novaop'`
2. Adicionar em `OP_META` com nome, cor CSS e info
3. Adicionar variáveis CSS `--novaop`, `--novaop-bg`
4. Adicionar classes `.dot-x`, `.lbl-x`, `.on-x`, `.sub-x`, `.tb-x`
5. Adicionar div do seletor em `#op-config-body`
6. Atualizar `buildOpConfig()` para incluir nova op no forEach
7. Atualizar `render()` para calcular `xP`, `xS`, `xT`, incluir nas colunas da tabela, blocos de total e winner

### Faixas etárias (ordem obrigatória nos arrays `precos`)
```
[0] 0-18  [1] 19-23  [2] 24-28  [3] 29-33  [4] 34-38
[5] 39-43  [6] 44-48  [7] 49-53  [8] 54-58  [9] 59+
```

---

## 4. ARQUIVO: `apresentacao-executiva.html`

### O que é
Gerador de apresentação executiva comercial. O corretor preenche um formulário e clica em "Gerar" — o sistema monta um documento profissional personalizado usando as metodologias **GPCT + SPIN Selling**.

### Funcionalidades do formulário (aba "Preencher dados")
- Nome do cliente, tipo de contratação (PME ou Adesão), data de validade
- Dores/necessidades do cliente (texto livre — alimenta o diagnóstico GPCT)
- Operadora recomendada, plano, mês/ano de reajuste, abrangência, acomodação
- **Cotação detalhada:** linhas dinâmicas de faixa etária + qtd + valor por vida + subtotal calculado automaticamente
- Tipo de coparticipação (sem / parcial / total) com teto mensal
- ARC: tempo de permanência no plano anterior (impacta texto de carências)
- Hospitais de destaque (até 5, seleção por checkbox com info de qual plano cobre)
- Vantagens estratégicas (checkbox: telemedicina, odonto, seguro viagem, UTI móvel, etc.)
- 3 próximos passos customizáveis

### Documento gerado (aba "Apresentação")
1. **Capa** — título personalizado com nome do cliente, badge de tipo de contratação, diagnóstico GPCT adaptativo (PME vs Adesão), metadados (operadora, produto, validade)
2. **Raio-X Financeiro** — tabela de vidas por faixa, total mensal, impacto anual, card de economia, alerta de meses até reajuste
3. **Mapeamento de Rede** — cards dos hospitais selecionados com etiqueta de qual produto cobre
4. **Vantagens Estratégicas** — cards dos benefícios selecionados
5. **Regras do Jogo** — coparticipação (3 textos distintos: sem / parcial / total + teto visual) + carências (texto adapta ao ARC informado)
6. **Próximos Passos** — 3 cards numerados + CTA urgência com data de validade

### Textos adaptativos gerados automaticamente
```javascript
// Diagnóstico muda conforme tipo
gerarDiagnostico(nome, tipo='pme'|'adesao', dores)

// Copart: 3 versões de texto
gerarCopartTxt(tipo='sem'|'parcial'|'total', teto)

// ARC: 4 versões de texto
gerarArcTxt(arc='nao'|'6a11'|'12a23'|'mais24')

// Meses até reajuste calculados em tempo real
mesesAteReajuste('Mar/2027') // retorna número inteiro
```

### Como adicionar nova operadora no gerador
1. Adicionar em `PLANOS_DB` com array de produtos
2. Adicionar em `OP_META` com nome e cor
3. Adicionar `<option>` no select `#g-op`

---

## 5. ARQUIVO: `saude_prime_operadoras.json`

### O que é
Base de dados JSON padronizada e reutilizável com todos os dados técnicos das operadoras. Estruturada para integração com banco de dados (MongoDB, PostgreSQL JSONB, Firebase, REST API).

### Schema de cada operadora
```json
{
  "operadora": "string",
  "administradora": "string",
  "tipo_contratacao": "string",
  "vigencia": "string",
  "reajuste": "string",
  "abrangencia": "string",
  "taxa_associativa": "number",
  "entrevista_medica": "boolean",

  "produtos": [
    {
      "produto": "string",
      "segmentacao": "string",
      "acomodacao": "Enfermaria|Apartamento|Não se aplica",
      "coparticipacao": {
        "tipo": "sem|parcial|total",
        "percentual": "number (se aplicável)",
        "teto_mensal": "number (se aplicável)",
        "modelo": "percentual|valor_fixo",
        "valores_fixos": {},
        "limites": {}
      },
      "faixas_etarias": ["0-18","19-23",...,"59+"],
      "valores": [0.00, 0.00, ...],
      "diferencial": "string (opcional)"
    }
  ],

  "rede_hospitalar": [
    {
      "nome": "string",
      "cidade": "string",
      "regiao": "string (opcional)",
      "coberturas": ["PS","INT","AMB","MAT"],
      "produtos": ["string"]
    }
  ],

  "laboratorios": ["string"],

  "carencias": {
    "procedimento": {
      "padrao": "string",
      "arc400|rc1|...": "string"
    }
  },

  "arc": {},
  "diferenciais": ["string"],
  "restricoes": ["string"],
  "observacoes": ["string"]
}
```

### Status das operadoras no JSON
| Operadora | Produtos | Rede | Carências | ARC |
|-----------|----------|------|-----------|-----|
| Unity Saúde | ✅ 6 | ✅ 15 hospitais | ✅ completo | ✅ completo |
| Evo Saúde | ✅ 6 | ✅ 8 + Amparo | ✅ RC1/2/3 | ✅ completo |
| Plenum Saúde | ✅ 8 | ✅ 15 hospitais | ✅ RC1/RC2 | ✅ completo |
| Amil | ✅ 20 | ⬜ pendente | ⬜ pendente | ⬜ pendente |

---

## 6. OPERADORAS PENDENTES

Estas operadoras ainda não foram adicionadas ao sistema. Aguardam envio de PDF de tabela de preços:

| Operadora | Status |
|-----------|--------|
| MedSênior | ⬜ pendente |
| HapVida | ⬜ pendente |
| Bradesco Saúde | ⬜ pendente |
| SulAmérica Saúde | ⬜ pendente |
| Porto Saúde | ⬜ pendente |
| Quallity Pro Saúde | ⬜ pendente |

### Fluxo para adicionar nova operadora
1. Usuário envia PDF da tabela de preços no chat
2. Extrair: nome dos produtos, acomodação, coparticipação, valores por faixa etária
3. Adicionar ao array `PLANOS` em `cotador-planos-saude.html`
4. Adicionar ao `PLANOS_DB` em `apresentacao-executiva.html`
5. Adicionar bloco completo em `saude_prime_operadoras.json`
6. Adicionar aba/seção de rede e carências nos HTMLs quando disponíveis

---

## 7. DECISÕES DE DESIGN E ARQUITETURA

### Por que arquivos HTML standalone?
- Funcionam offline (o corretor pode usar em reuniões sem internet)
- Sem dependência de servidor ou backend
- Fácil de compartilhar por e-mail ou WhatsApp
- A logo é embutida em base64 para não depender de caminhos externos

### Logo Saúde Prime
- Arquivo original: `Logo_Saude_Prime__1_.png`
- **Atenção:** o arquivo é JPEG apesar da extensão `.png` (magic bytes `ffd8ffe0`)
- Nos HTMLs usar: `data:image/jpeg;base64,...`
- Sempre usar `onerror="this.style.display='none'"` como fallback

### Estrutura de planos (array flat vs nested)
O cotador usa array flat de planos (`const PLANOS = [...]`) em vez de objeto aninhado por operadora. Isso facilita filtrar planos por múltiplos critérios (operadora, acomodação, coparticipação) com `.filter()` simples.

### Seletor independente por operadora
Cada operadora tem seu próprio select de plano — isso permite comparar Unity Enfermaria vs Plenum Apartamento vs Amil Ouro simultaneamente, sem um seletor global de acomodação.

### Tabela de resultado
Mostra **apenas** faixas com qtd > 0. Faixas zeradas ficam ocultas. A linha de total aparece dentro da tabela (não só nos cards abaixo).

---

## 8. METODOLOGIAS COMERCIAIS IMPLEMENTADAS

### GPCT (Goals, Plans, Challenges, Timeline)
Usado na apresentação executiva. O diagnóstico inicial adapta o texto conforme:
- **PME:** foco em proteção do capital humano, previsibilidade de caixa, continuidade operacional
- **Adesão:** foco em segurança familiar, sem surpresas financeiras, rede próxima

### SPIN Selling (Situation, Problem, Implication, Need-Payoff)
Estrutura da apresentação:
- **S (Situação):** diagnóstico inicial + raio-X financeiro
- **P (Problema):** dores informadas pelo corretor
- **I (Implicação):** custo de não ter o plano / risco de reajuste
- **N (Need-Payoff):** vantagens, economia calculada, próximos passos

### Gatilhos de urgência reais
- Meses até o reajuste são calculados automaticamente da data atual
- Data de validade da proposta gera CTA urgência no fechamento
- Economia anual (diferença × 12) apresentada como "dinheiro no cofrinho"

---

## 9. CONVENÇÕES DE CÓDIGO

### IDs dos planos
- `u1-u6`: Unity Saúde
- `e1-e6`: Evo Saúde
- `p1-p8`: Plenum Saúde
- `a1-a20`: Amil (a1-a10 copart total, a11-a20 copart parcial)
- Próximas operadoras: `m1-mN` (MedSênior), `h1-hN` (HapVida), etc.

### Classes CSS por operadora
```css
/* Cores */
.dot-u / .lbl-u / .on-u / .sub-u / .tb-u  → Unity (#0f2340)
.dot-e / .lbl-e / .on-e / .sub-e / .tb-e  → Evo (#5c1a40)
.dot-p / .lbl-p / .on-p / .sub-p / .tb-p  → Plenum (#0a4028)
.dot-a / .lbl-a / .on-a / .sub-a / .tb-a  → Amil (#d4000f)
```

### Tags de cobertura hospitalar
- `PS` = Pronto-Socorro 24h
- `INT` = Internação
- `AMB` = Ambulatório
- `MAT` = Maternidade

---

## 10. PRÓXIMOS DESENVOLVIMENTOS SUGERIDOS

### Curto prazo
- [ ] Adicionar rede credenciada da Amil nos HTMLs
- [ ] Adicionar carências da Amil no JSON e nos HTMLs
- [ ] Adicionar MedSênior (envio de PDF pendente)
- [ ] Corrigir logo no cotador (verificar se está renderizando)

### Médio prazo
- [ ] Integrar cotador e apresentação em um único arquivo (botão "Gerar apresentação" dentro do cotador, passando os dados automaticamente)
- [ ] Adicionar campo de observações por faixa etária (ex: "beneficiário com preexistência")
- [ ] Exportação para PDF com layout customizado (usando `window.print()` já implementado)
- [ ] Salvar cotações localmente (localStorage ou IndexedDB)

### Longo prazo
- [ ] API REST com o JSON como base de dados
- [ ] Dashboard de cotações salvas
- [ ] CRM básico (histórico de clientes)
- [ ] Integração com WhatsApp Business API para envio automático

---

## 11. CONTEXTO DO CHAT ORIGINAL

Este projeto foi desenvolvido em sessão de chat com Claude (claude.ai). O arquivo de transcrição completo está disponível em:
`/mnt/transcripts/2026-05-14-08-22-02-cotador-planos-saude-prime.txt`

### Evolução do projeto
1. Cotador básico com Unity, Evo e Plenum
2. Adição de abas de Rede Credenciada e Carências
3. Redesign visual (minimalista/sofisticado) + layout compacto
4. Inputs de faixas etárias movidos para sidebar com botões +/−
5. Seletor independente de plano por operadora (sem acomodação global)
6. Adição da Amil (20 produtos do PDF da tabela de preços)
7. Gerador de apresentação executiva com GPCT + SPIN Selling
8. Prompt atualizado com metodologia completa: diagnóstico, raio-X financeiro, mapeamento de rede, vantagens estratégicas, regras técnicas, fechamento CTA
9. Geração do JSON padronizado para todas as operadoras
10. Criação deste arquivo de contexto para Claude Code

---

*Saúde Prime Seguros e Saúde — Sistema desenvolvido em Mai/2026*
