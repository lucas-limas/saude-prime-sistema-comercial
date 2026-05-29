# Cotador de Planos de Saúde — Saúde Prime

> Projeto desenvolvido para o Módulo 3 – Low Code / No Code / Vibecode  
> Curso de Engenharia de Software — 2026/1

---

## Sobre o Projeto

Sistema comercial para corretores de planos de saúde, desenvolvido com a plataforma **Make** (anteriormente Integromat) — sem escrever código.

O sistema resolve um problema real do dia a dia de corretores: a cotação manual via planilhas de Excel, que é lenta, propensa a erros e gera apresentações pouco profissionais para os clientes. Com esta ferramenta, o corretor preenche um formulário, o fluxo do Make processa as informações e entrega o resultado da cotação automaticamente.

---

## Demonstração

**Formulário de cotação (Make Forms):** [https://us.makeforms.co/cowcpih/](https://us.makeforms.co/cowcpih/)

**Relatório completo do projeto:** [docs/relatorio.html](docs/relatorio.html)

---

## Funcionalidades

- **Formulário de cotação** via Make Forms: cliente, faixas etárias, quantidades e modalidade de contratação
- **Fluxo automatizado** no Make: processa os dados e calcula os valores por operadora
- **Entrega automática** do resultado via e-mail ao corretor após o preenchimento
- **Registro de cotações** em planilha Google Sheets para consulta posterior

---

## Estrutura do Sistema

```
Make Forms          → formulário de entrada de dados do corretor
Cenário Make        → fluxo de automação que processa a cotação
Google Sheets       → armazenamento das tabelas de preços e histórico
Módulo de E-mail    → envio automático do resultado ao corretor
```

Toda a lógica de cotação vive dentro do cenário Make. Para atualizar preços ou adicionar operadoras, basta editar os módulos do fluxo — sem código, sem deploy.

---

## Como Usar

1. Acesse o formulário: [https://us.makeforms.co/cowcpih/](https://us.makeforms.co/cowcpih/)
2. Preencha os dados do cliente (nome, faixas etárias, quantidades)
3. Selecione a modalidade de contratação desejada
4. Envie o formulário — o fluxo roda automaticamente
5. O resultado da cotação é entregue por e-mail ao corretor

---

## Stack Tecnológica

| Tecnologia / Recurso | Uso |
|---|---|
| Make Forms | Formulário de coleta de dados do corretor |
| Cenários Make | Fluxo de automação que processa e calcula a cotação |
| Módulo de E-mail (Make) | Envio automático dos resultados |
| Google Sheets | Armazenamento das tabelas de preços e histórico de cotações |
| Git + GitHub | Versionamento da documentação do projeto |

---

## Abordagem de Desenvolvimento: No-Code com Make

Este projeto foi desenvolvido integralmente com a plataforma **Make**, seguindo a abordagem no-code — os fluxos são montados arrastando e conectando módulos visuais, sem escrever uma linha de código.

### O que funcionou bem
- Interface visual facilita entender o fluxo completo de uma vez
- Make Forms já vem integrado ao cenário por padrão — sem configuração extra
- Ajustes e correções são feitos diretamente no editor visual, sem redesploy
- Plano gratuito suficiente para desenvolvimento e testes

### O que aprendemos na prática
- No-code não substitui entender o problema — montar módulos sem clareza do fluxo gera automações frágeis
- Lógica condicional complexa (múltiplas operadoras, regras por faixa etária) cresce rápido e precisa ser dividida em sub-cenários
- O limite de operações do plano gratuito exige planejamento para uso em produção
- Questões de LGPD precisam ser endereçadas antes de coletar dados reais de clientes

---

## Contexto Acadêmico

**Disciplina:** Engenharia de Prompt e Aplicações de IA  
**Módulo:** 3 — Low Code / No Code / Vibecode  
**Professor(a):** Kadidja Valéria  
**Instituição:** [Nome da Instituição]  
**Semestre:** 2026/1

---

## Autor

**Lucas Limas**  
Engenharia de Software — 2º Semestre  
[github.com/lucas-limas](https://github.com/lucas-limas)
