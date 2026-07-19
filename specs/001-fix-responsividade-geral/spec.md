# Feature Specification: Correção Geral de Responsividade

**Feature Branch**: `001-fix-responsividade-geral`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Vamos fazer uma spec de correção de responsividade geral, pois em alguns notebooks com telas menores na altura fica ruim além que podem ter outras coisas que deixam ruim olha o responsivo aqui como ficou ruim essas imagens sou eu tentando simular o que acontece em algumas telas e precisamos melhorar para o mais completo em outras telas possível."

## Clarifications

### Session 2026-07-19

- Q: Quais páginas/áreas do site entram no escopo desta correção de
  responsividade? → A: Só páginas públicas do portfólio (Início, Sobre,
  Projetos, Progresso, Blog e Contato). Dashboard e Login (área
  administrativa) ficam fora de escopo.
- Q: Qual matriz de resoluções/alturas deve ser usada como referência oficial
  para validar a correção? → A: Conjunto padrão de mercado — mobile retrato
  (375×667), mobile paisagem (667×375), tablet retrato (768×1024), tablet
  paisagem (1024×768), notebook de altura reduzida (1366×700), notebook
  padrão (1440×900), desktop (1920×1080) e monitor grande (2560×1440).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Título e conteúdo visíveis em telas de menor altura (Priority: P1)

Como visitante acessando o portfólio em um notebook com altura de tela reduzida
(por exemplo, telas 13"-14" com barra de tarefas/abas do navegador ocupando
espaço vertical), quero que o título de cada seção e o conteúdo principal
fiquem completamente visíveis abaixo do menu de navegação, para que eu consiga
ler a página sem que partes do texto fiquem escondidas atrás do cabeçalho.

**Why this priority**: É o problema mais visível e reportado — nas capturas de
tela fornecidas, os títulos "Sobre Mim" e "Projetos" aparecem cortados/atrás do
menu fixo. Isso passa uma impressão de descuido logo nas primeiras seções que
um recrutador ou cliente visualiza.

**Independent Test**: Redimensionar a janela do navegador (ou usar o modo de
dispositivo) para alturas entre 600px e 800px mantendo a largura de um
notebook padrão (ex.: 1366px, 1440px) e confirmar que os títulos de cada
página (Início, Sobre, Projetos, Progresso, Blog, Contato) aparecem totalmente
visíveis, sem sobreposição pelo menu fixo.

**Acceptance Scenarios**:

1. **Given** o navegador aberto com altura de viewport de 700px, **When** o
   visitante acessa a seção "Sobre", **Then** o título "Sobre Mim" e o
   parágrafo de descrição aparecem completamente abaixo do menu, sem corte ou
   sobreposição.
2. **Given** o navegador aberto com altura de viewport de 650px, **When** o
   visitante acessa a seção "Projetos", **Then** o título "Projetos", o
   subtítulo e o carrossel de projetos aparecem completamente visíveis e
   utilizáveis, sem sobreposição pelo menu.
3. **Given** qualquer seção da página inicial, **When** a altura da janela é
   reduzida gradualmente de 900px até 600px, **Then** nenhum elemento de texto
   ou título fica oculto atrás do cabeçalho fixo em nenhum ponto da transição.

---

### User Story 2 - Experiência consistente em toda a variedade de telas (Priority: P2)

Como visitante acessando o portfólio em diferentes dispositivos e resoluções
(celulares em retrato e paisagem, tablets, notebooks pequenos, monitores
ultrawide/grandes), quero que o layout de todas as seções se adapte de forma
consistente, para que a experiência pareça igualmente polida independente do
aparelho usado.

**Why this priority**: O pedido do usuário é explícito em "melhorar para o
mais completo em outras telas possível" — não é só a altura de notebooks, mas
uma revisão geral de responsividade em várias dimensões de tela.

**Independent Test**: Percorrer todas as páginas/seções públicas do portfólio
na matriz de resoluções canônica (ver Success Criteria) e confirmar ausência
de sobreposição, corte de texto, elementos espremidos ou espaçamento quebrado.

**Acceptance Scenarios**:

1. **Given** um dispositivo móvel em modo retrato, **When** o visitante navega
   por todas as seções, **Then** nenhum texto é cortado e nenhum elemento
   interativo fica inacessível.
2. **Given** um dispositivo móvel em modo paisagem (altura reduzida), **When**
   o visitante acessa qualquer seção, **Then** o conteúdo permanece legível e
   navegável sem sobreposição pelo menu.
3. **Given** um monitor grande (largura acima de 1920px), **When** o visitante
   acessa qualquer seção, **Then** o conteúdo mantém proporção e alinhamento
   adequados, sem espaços vazios excessivos ou elementos desproporcionais.

---

### User Story 3 - Componentes interativos utilizáveis em qualquer tamanho de tela (Priority: P3)

Como visitante interagindo com elementos como o carrossel de projetos, os
cartões de tecnologias (stacks) e os botões de ação, quero que esses
componentes permaneçam totalmente visíveis e clicáveis em qualquer tamanho de
tela, para que eu consiga navegar pelo conteúdo sem barreiras.

**Why this priority**: Nas imagens fornecidas, o carrossel de projetos ocupa
grande parte da tela em alturas reduzidas; setas de navegação e cartões
adjacentes precisam continuar acessíveis mesmo quando o espaço vertical é
menor.

**Independent Test**: Em uma tela de altura reduzida, testar a navegação do
carrossel de projetos (setas anterior/próximo) e a rolagem da lista de
tecnologias, confirmando que todos os controles permanecem visíveis e
funcionais.

**Acceptance Scenarios**:

1. **Given** o carrossel de projetos em uma tela de 700px de altura, **When**
   o visitante clica na seta "próximo", **Then** o card seguinte é exibido
   corretamente e as setas permanecem visíveis e clicáveis.
2. **Given** a lista de cartões de tecnologias (stacks) em uma tela estreita,
   **When** o visitante rola a seção, **Then** todos os cartões permanecem
   legíveis e nenhum ícone/texto é cortado nas bordas.

---

### Edge Cases

- O que acontece quando a altura da janela é extremamente reduzida (ex.:
  janela dividida ao meio da tela, ~500px de altura)? O conteúdo essencial
  (título e call-to-action principal) deve permanecer acessível via rolagem,
  sem ficar preso atrás do menu.
- Como o layout se comporta quando o usuário aumenta o zoom do navegador
  (125%, 150%), o que reduz a altura/largura efetiva da viewport?
- Como as seções se comportam em orientação paisagem de celular, onde a altura
  é frequentemente menor que 450px?
- O que acontece quando o conteúdo textual é mais longo que o espaço vertical
  disponível em uma seção pensada para caber em uma tela cheia (ex.: bio mais
  extensa em "Sobre")?
- Como os efeitos visuais (partículas, animações de fundo) se comportam em
  telas pequenas para não prejudicar a performance nem a legibilidade?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST garantir que o título e o conteúdo principal de
  cada seção/página fiquem completamente visíveis abaixo do menu de navegação
  fixo, em qualquer altura de viewport dentro da faixa suportada (mínimo de
  600px de altura).
- **FR-002**: O sistema MUST manter espaçamento e legibilidade adequados em
  todas as páginas públicas do portfólio (Início, Sobre, Projetos, Progresso,
  Blog, Contato) na matriz de resoluções canônica: mobile retrato (375×667),
  mobile paisagem (667×375), tablet retrato (768×1024), tablet paisagem
  (1024×768), notebook de altura reduzida (1366×700), notebook padrão
  (1440×900), desktop (1920×1080) e monitor grande (2560×1440).
- **FR-003**: O sistema MUST evitar que o dimensionamento das seções dependa
  exclusivamente de altura total da viewport de forma que gere sobreposição ou
  corte de conteúdo quando a altura disponível for menor que a esperada.
- **FR-004**: Os controles interativos do carrossel de projetos (navegação
  anterior/próximo, indicadores) MUST permanecer totalmente visíveis e
  utilizáveis em qualquer altura/largura de tela suportada.
- **FR-005**: A lista de cartões de tecnologias (stacks) MUST permanecer
  legível, sem cortes de ícone ou texto, em telas estreitas ou de baixa
  altura.
- **FR-006**: Nenhuma seção MUST exibir texto sobreposto a outro elemento
  (menu, imagem, outro texto) em qualquer ponto da faixa de resoluções
  suportada.
- **FR-007**: O sistema MUST preservar o comportamento e a aparência atuais em
  resoluções onde o layout já funciona corretamente (não regressão em telas
  padrão de desktop/mobile já validadas).

### Key Entities

*(Seção omitida — esta funcionalidade é uma correção de layout/responsividade
e não introduz ou altera entidades de dados.)*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das combinações testadas de largura x altura de
  viewport (incluindo notebooks com altura entre 600px e 800px), o título de
  cada seção permanece totalmente visível, sem sobreposição pelo menu de
  navegação.
- **SC-002**: Zero ocorrências de texto ou elemento interativo cortado/
  sobreposto ao revisar visualmente todas as páginas públicas nas 8
  dimensões de tela da matriz canônica (mobile retrato 375×667, mobile
  paisagem 667×375, tablet retrato 768×1024, tablet paisagem 1024×768,
  notebook de altura reduzida 1366×700, notebook padrão 1440×900, desktop
  1920×1080, monitor grande 2560×1440).
- **SC-003**: Um visitante consegue visualizar e interagir com todas as
  seções principais (incluindo o carrossel de projetos) sem precisar
  redimensionar a janela ou dar zoom-out manualmente para "consertar" a
  visualização.
- **SC-004**: A navegação pelo carrossel de projetos permanece 100% funcional
  (setas visíveis e clicáveis) em todas as alturas de tela testadas.

## Assumptions

- A faixa de alturas de viewport consideradas "notebooks com telas menores"
  vai de aproximadamente 600px a 800px de altura útil (descontando barra de
  endereço/abas do navegador), cobrindo notebooks 13"-14" comuns.
- A correção abrange todas as páginas públicas do portfólio (Início, Sobre,
  Projetos, Progresso, Blog, Contato), não apenas as duas seções
  exemplificadas nas imagens fornecidas. Dashboard e Login (área
  administrativa) estão fora de escopo desta correção.
- O menu de navegação (navbar) continua fixo/sticky no topo da página; a
  correção ajusta o conteúdo abaixo dele, e não o comportamento do próprio
  menu.
- Dispositivos e navegadores já suportados hoje pelo portfólio continuam sendo
  o público-alvo; não há necessidade de suportar resoluções abaixo de 320px de
  largura ou navegadores legados sem suporte a CSS moderno (flexbox/grid).
- Efeitos visuais (partículas, animações) podem ser simplificados ou ocultados
  em telas menores caso isso seja necessário para preservar a legibilidade e a
  performance, desde que o conteúdo principal continue acessível.
