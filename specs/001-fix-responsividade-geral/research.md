# Research: Correção Geral de Responsividade

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Nenhum marcador `NEEDS CLARIFICATION` restou no Technical Context — todas as
decisões abaixo documentam a investigação da causa raiz e as escolhas
técnicas para a Fase 1, não perguntas em aberto.

## 1. Causa raiz do corte/sobreposição em telas de menor altura

**Decision**: O problema vem da combinação de três fatores presentes nas
seções full-height (`about`, `projects`, `home`, `blog-preview`, `contact`):

1. `height: 100vh` / `100dvh` fixo + `position: sticky; top: 0`.
2. Conteúdo centralizado verticalmente (`display: flex; align-items: center;
   justify-content: center`) dentro dessa altura fixa.
3. Nenhum espaço reservado para o header fixo (`position: fixed; top: ~20px;
   height: 80px` no desktop, reduzindo para 55–70px em breakpoints menores),
   exceto em `education.scss`, que já usa `padding-top: 100px`.

Quando a altura da viewport diminui (notebook de tela menor, celular em
paisagem, zoom do navegador), o conteúdo centralizado "sobe" visualmente e
passa a ocupar a área ocupada pelo header fixo, causando exatamente o corte
visto nas capturas de tela ("Sobre Mim" e "Projetos").

**Rationale**: Confirmado por inspeção direta dos arquivos-fonte
(`about.scss`, `projects.scss`, `education.scss`, `header.scss`) — não é uma
hipótese, é o comportamento atual do código.

**Alternatives considered**: N/A (diagnóstico, não decisão de design).

## 2. Mecanismo de reserva de espaço para o header

**Decision**: Extrair o offset do header (altura + margem de topo, por
breakpoint) para um mixin SCSS ou variável CSS compartilhada (ex.: em
`app.scss`, ao lado dos mixins `premium-background` e `section-content-glass`
já existentes) e aplicá-la de forma consistente em todas as seções
full-height públicas, substituindo o `padding-top: 100px` isolado de
`education.scss` e adicionando a mesma reserva às seções que hoje não têm
nenhuma (`about`, `projects`, `home`, `blog-preview`, `contact`).

**Rationale**: Atende diretamente ao Princípio III da constituição (Component
Reuse & Composition / DRY) — o bug existe justamente porque o valor de offset
está duplicado e dessincronizado entre componentes. Um único ponto de verdade
elimina a classe inteira de bug (não só os dois casos reportados).

**Alternatives considered**:
- **JavaScript com `ResizeObserver`** para calcular e injetar o offset em
  tempo de execução — rejeitado: adiciona complexidade e custo de runtime
  para um problema inteiramente resolvível em CSS declarativo (viola
  simplicidade/YAGNI).
- **Remover `position: sticky` / scroll-snap full-height** e migrar para
  fluxo de documento natural — rejeitado: seria um redesenho muito maior do
  que o solicitado (a spec pede correção de responsividade, não mudança de
  paradigma de navegação).

## 3. Unidades de altura de viewport (vh vs dvh/svh) e comportamento em alturas extremas

**Decision**: Manter o padrão já parcialmente adotado (`height: 100vh;
height: 100dvh;` como fallback progressivo) e trocar `height` fixo por
`min-height` nas seções full-height, permitindo que o conteúdo role
internamente em vez de ser cortado quando a altura disponível for menor que o
conteúdo mínimo necessário (atende ao edge case de janelas extremamente
reduzidas, ~500px, descrito na spec).

**Rationale**: `dvh`/`svh` já são suportados pelos navegadores-alvo do
projeto e resolvem a variação de altura causada por barras de UI móveis;
`min-height` em vez de `height` fixo evita que o conteúdo seja
espremido/cortado quando não cabe, convertendo o problema em rolagem (aceito
pela spec) em vez de sobreposição (não aceito pela spec).

**Alternatives considered**:
- Manter `height` fixo e apenas reduzir tamanhos de fonte agressivamente em
  telas curtas — rejeitado: não escala para conteúdo textual variável (ex.:
  bio mais longa) e ainda pode cortar em casos extremos.

## 4. Eixo de breakpoints por altura

**Decision**: Introduzir media queries baseadas em `min-height`/`max-height`
como um eixo novo e explícito (ex.: `@media (max-height: 700px)`), separado
dos breakpoints de largura já existentes no projeto (576/768/992/1200px).

**Rationale**: A varredura do código confirmou que **não existe nenhuma
media query baseada em altura** no projeto hoje — todo o sistema de
breakpoints é orientado a largura. Isso explica por que o problema só
aparece em resoluções de notebook (largura grande, altura pequena): nenhuma
regra de CSS reage a essa combinação. A matriz canônica definida na
clarificação da spec (mobile retrato/paisagem, tablet retrato/paisagem,
notebook baixo 1366×700, notebook padrão, desktop, monitor grande) cobre
exatamente essa combinação largura×altura e serve de base para os pontos de
corte por altura.

**Alternatives considered**:
- Resolver apenas via `dvh`/`min-height` sem media queries de altura
  dedicadas — insuficiente sozinho para casos onde o espaçamento (não só a
  altura do bloco) precisa encolher em telas baixas (ex.: `gap`, `padding`
  verticais generosos que fazem sentido em 900px de altura mas não em
  650px).

## 5. Estratégia de verificação

**Decision**: Validação primariamente visual/manual contra a matriz de 8
resoluções canônicas (ver `quickstart.md`), complementada pela suíte Vitest
existente rodando sem regressões (nenhum teste unitário novo é necessário,
pois não há lógica de programa nova — é uma correção estrutural de CSS/
template).

**Rationale**: Alinhado ao Princípio V da constituição, que reserva Vitest
para "lógica não-trivial"; um ajuste de CSS/layout não produz asserções de
unidade significativas além de "o componente ainda renderiza", já coberto
pelos specs existentes.

**Alternatives considered**:
- Introduzir testes de regressão visual automatizados (screenshot diffing) —
  desejável a longo prazo, mas fora do escopo desta correção pontual (não
  há ferramenta de regressão visual configurada no projeto hoje).
