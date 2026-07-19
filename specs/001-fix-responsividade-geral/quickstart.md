# Quickstart: Validação da Correção Geral de Responsividade

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Guia para validar manualmente que a correção resolve os problemas descritos
na spec, usando a matriz de resoluções canônica definida em
[Clarifications](./spec.md#clarifications).

## Pré-requisitos

- Node.js e dependências instaladas (`npm install`, se ainda não feito)
- Nenhuma configuração adicional — a correção é apenas CSS/template

## Setup

```bash
npm start
```

Abra `http://localhost:4200` no navegador.

## Como testar cada resolução

Use as ferramentas de desenvolvedor do navegador → modo de dispositivo
responsivo → dimensões customizadas (largura × altura), para cada uma das 8
entradas da matriz canônica:

| # | Dispositivo | Largura × Altura |
|---|---|---|
| 1 | Mobile retrato | 375 × 667 |
| 2 | Mobile paisagem | 667 × 375 |
| 3 | Tablet retrato | 768 × 1024 |
| 4 | Tablet paisagem | 1024 × 768 |
| 5 | Notebook (altura reduzida) | 1366 × 700 |
| 6 | Notebook padrão | 1440 × 900 |
| 7 | Desktop | 1920 × 1080 |
| 8 | Monitor grande | 2560 × 1440 |

Para cada dimensão, percorra as 6 páginas públicas (Início, Sobre, Projetos,
Progresso, Blog, Contato) navegando pelo menu ou rolando a página inicial.

## O que verificar (mapeado aos critérios de sucesso da spec)

- [ ] **SC-001 / FR-001**: O título de cada seção está totalmente visível
      abaixo do menu fixo — sem nenhuma parte coberta pelo header.
- [ ] **SC-002 / FR-006**: Nenhum texto ou elemento interativo está
      cortado ou sobreposto a outro elemento em nenhuma das 8 dimensões.
- [ ] **SC-003**: É possível ver e interagir com todas as seções sem
      precisar redimensionar a janela ou dar zoom manualmente.
- [ ] **SC-004 / FR-004**: No carrossel de projetos ("Projetos"), as setas de
      navegação anterior/próximo permanecem visíveis e clicáveis; clicar
      avança/retrocede o card corretamente.
- [ ] **FR-005**: Na seção "Sobre", a lista de cartões de tecnologias
      (stacks) não corta ícones nem texto nas bordas.
- [ ] **FR-007 (não regressão)**: Nas resoluções onde o layout já era
      considerado correto antes da correção (ex.: desktop 1920×1080, mobile
      375×667 em altura normal), a aparência permanece consistente — sem
      mudanças visuais inesperadas.

## Casos extremos (Edge Cases da spec)

- [ ] Reduza a altura da janela gradualmente até ~500px (ex.: divida a tela
      do desktop ao meio verticalmente): o conteúdo principal deve continuar
      acessível via rolagem, nunca preso atrás do header.
- [ ] Aumente o zoom do navegador para 125% e 150% em uma janela de notebook
      padrão: nenhum título deve ficar coberto pelo header.
- [ ] Simule celular em paisagem (altura < 450px): conteúdo permanece
      legível e navegável.

## Regressão automatizada

```bash
npm test
```

A suíte Vitest existente (incluindo `navbar.spec.ts` e demais specs de
componentes afetados) deve continuar passando sem alterações — esta
correção não introduz lógica de programa nova para cobrir com testes de
unidade (ver [research.md](./research.md#5-estratégia-de-verificação)).

## Critério de conclusão

Todos os itens acima marcados ✅ nas 8 dimensões da matriz, nas 6 páginas
públicas, sem regressões na suíte Vitest.
