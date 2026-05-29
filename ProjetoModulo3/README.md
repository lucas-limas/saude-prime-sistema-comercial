# Projeto Módulo 3 – Low Code/No Code/Vibecode

## 📌 Desafio Escolhido

Automação da cotação de planos de saúde para corretores. O desafio consistiu em substituir o processo manual de cotação via planilhas Excel — lento, propenso a erros e com resultados pouco profissionais — por um sistema automatizado que, a partir de um formulário preenchido pelo corretor, calcula os valores por operadora e entrega o resultado por e-mail automaticamente, sem escrever uma linha de código.

---

## 🖥️ Protótipo

- **Formulário de cotação (Make Forms):** [https://us.makeforms.co/cowcpih/](https://us.makeforms.co/cowcpih/)
- **Relatório completo do projeto:** [docs/relatorio.html](docs/relatorio.html)

O corretor preenche o formulário com os dados do cliente (nome, faixas etárias, quantidades e modalidade de contratação). O cenário Make processa as informações, calcula os valores por operadora e envia o resultado automaticamente por e-mail. Todas as cotações ficam registradas em uma planilha Google Sheets para consulta posterior.

> Arquivos de imagem e PDF estão na pasta `/docs`.

---

## ⚙️ Plataforma Utilizada

- **Make** (anteriormente Integromat)

- Foi escolhida porque o Make Forms já vem integrado ao cenário por padrão — sem configuração extra — e porque a interface visual permite montar o fluxo completo (formulário → processamento → e-mail → planilha) de forma rápida e legível. O plano gratuito é suficiente para desenvolvimento e testes, e ajustes de lógica ou preços são feitos diretamente no editor visual sem necessidade de deploy.

---

## ✅ Vantagens Identificadas

1. **Protótipo rápido:** A interface visual do Make permite enxergar e montar o fluxo completo de uma vez, reduzindo drasticamente o tempo de desenvolvimento
2. **Integração simples:** Make Forms, Google Sheets e módulo de e-mail já se conectam nativamente dentro da plataforma, sem configuração extra
3. **Automação de processos:** Toda a lógica de cotação vive no cenário — para atualizar preços ou adicionar operadoras basta editar os módulos, sem código e sem redesploy

---

## ⚠️ Limitações Encontradas

1. **Customização limitada:** Lógica condicional complexa (múltiplas operadoras, regras por faixa etária) cresce rápido e precisa ser dividida em sub-cenários para não virar um fluxo ingerenciável
2. **Dependência da plataforma:** O limite de operações do plano gratuito exige planejamento para uso em produção — escalar o volume de cotações implica custo ou troca de plano
3. **Risco de lock-in tecnológico:** Toda a lógica está dentro do Make; migrar para outra ferramenta significa recriar os fluxos do zero, além de questões de LGPD que precisam ser endereçadas antes de coletar dados reais de clientes

---

## 📚 Reflexão Crítica

A principal aprendizagem foi que no-code não substitui entender o problema — montar módulos sem clareza do fluxo gera automações frágeis. Para lidar com a complexidade da lógica de cotação (múltiplas operadoras e regras por faixa etária), a solução foi dividir o cenário em sub-cenários menores e responsabilidades bem definidas. O limite de operações foi contornado otimizando o número de módulos por execução e priorizando os passos estritamente necessários. Para as questões de LGPD, o grupo identificou que seria preciso adicionar um módulo de anonimização ou obtenção de consentimento antes de qualquer uso com dados reais.

---

## 👥 Colaboração

O projeto foi desenvolvido por Lucas Limas. O fluxo de trabalho seguiu etapas sequenciais: levantamento do problema real do corretor → desenho do fluxo no Make → construção do formulário → testes de ponta a ponta → documentação. O versionamento da documentação foi feito via Git + GitHub ao longo de todo o processo.

---

## 📝 Registro da Aula

Data: **11/05/2026**

Atividade: Discussão crítica + mini-projeto de aplicação

Local: Laboratório de informática / Quadro branco

Professor(a): Kadidja Valéria

---

## 🚀 Próximos Passos

- Adicionar suporte a mais operadoras no fluxo, organizadas em sub-cenários por modalidade de contratação
- Implementar módulo de consentimento/anonimização de dados para adequação à LGPD antes de uso com clientes reais
- Criar painel no Google Sheets com métricas das cotações (operadoras mais cotadas, faixas mais frequentes)
- Avaliar migração para plano pago do Make ou alternativas open-source (n8n) caso o volume de cotações justifique
