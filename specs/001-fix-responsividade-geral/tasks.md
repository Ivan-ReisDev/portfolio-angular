---
description: "Task list for Correção Geral de Responsividade"
---

# Tasks: Correção Geral de Responsividade

**Input**: Design documents from `/specs/001-fix-responsividade-geral/`
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: Não solicitados na spec. Esta correção é majoritariamente CSS/template sem lógica de programa nova; a verificação funcional é feita via a matriz visual do `quickstart.md` (ver [research.md §5](./research.md#5-estratégia-de-verificação)). A suíte Vitest existente é usada apenas como guarda de regressão (tarefa de Polish).

**Organization**: Tarefas agrupadas por user story (spec.md) para permitir implementação e validação independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefas incompletas)
- **[Story]**: A qual user story a tarefa pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos em cada descrição

## Path Conventions

Aplicação Angular única existente — todos os caminhos são relativos à raiz do
repositório, dentro de `src/app/`. Não há separação backend/frontend nem
múltiplos projetos.

---

## Phase 1: Setup

**Purpose**: Confirmar baseline limpo antes de qualquer alteração

- [X] T001 Rodar `npm start` na raiz do repositório e confirmar que a aplicação sobe sem erros antes de qualquer alteração
- [X] T002 [P] Rodar `npm test` na raiz do repositório e registrar o resultado atual (baseline) da suíte Vitest, para comparação após as mudanças

**Checkpoint**: Baseline validado — seguro iniciar as alterações

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criar o mecanismo compartilhado de offset do header e o eixo de
breakpoints por altura, dos quais todas as user stories dependem (ver
[research.md §2 e §4](./research.md))

**⚠️ CRITICAL**: Nenhuma user story pode ser implementada antes desta fase estar completa

- [X] T003 Adicionar mixin/custom properties compartilhadas de offset do header em `src/app/app.scss`, com os valores derivados de `src/app/core/components/header/header.scss` por breakpoint de largura (desktop: 80px altura + 20px topo; ≤1199px: 70px + margem; ≤991px: 65px + 15px; ≤767px: 60px + 10px; ≤575px: 55px + 10px)
- [X] T004 Adicionar breakpoints baseados em altura (`min-height`/`max-height`) em `src/app/app.scss`, cobrindo a faixa de notebooks de altura reduzida (~600–800px) definida na matriz canônica do spec, para uso pelas seções full-height nas fases seguintes
- [X] T005 [P] Refatorar `src/app/core/components/education/education.scss` para consumir o mixin/custom property de offset criado em T003 no lugar do `padding-top: 100px` fixo, estabelecendo-o como referência de padrão correto para as demais seções

**Checkpoint**: Mecanismo de offset e eixo de breakpoints por altura prontos — user stories podem começar

---

## Phase 3: User Story 1 - Título e conteúdo visíveis em telas de menor altura (Priority: P1) 🎯 MVP

**Goal**: Garantir que os títulos e o conteúdo de "Sobre" e "Projetos" nunca fiquem atrás do header fixo em telas de notebook com altura reduzida

**Independent Test**: Ver [quickstart.md](./quickstart.md) — redimensionar para 1366×700 e 1440×900 e confirmar títulos totalmente visíveis em "Sobre" e "Projetos"

### Implementation for User Story 1

- [X] T006 [P] [US1] Corrigir a seção `.about` em `src/app/core/components/about/about.scss`: aplicar o mixin de offset do header (T003) e converter `height: 100vh/100dvh` fixo para `min-height`, para que o título/conteúdo nunca renderize atrás do header e role em vez de cortar em viewports curtas
- [X] T007 [P] [US1] Corrigir a seção `#projetos` em `src/app/core/components/projects/projects.scss`: aplicar o mixin de offset do header (T003) e converter `height: 100vh/100dvh` fixo para `min-height`, para que o título/subtítulo/carrossel nunca renderizem atrás do header e rolem em vez de cortar em viewports curtas
- [X] T008 [P] [US1] Adicionar as media queries de altura (T004) em `src/app/core/components/about/about.scss`, reduzindo `gap`/`padding` verticais em viewports curtas (~600–800px de altura)
- [X] T009 [P] [US1] Adicionar as media queries de altura (T004) em `src/app/core/components/projects/projects.scss`, reduzindo `gap`/`padding` verticais em viewports curtas (~600–800px de altura)
- [ ] T010 [US1] Validar manualmente a User Story 1 usando [quickstart.md](./quickstart.md): confirmar que os títulos de "Sobre" e "Projetos" ficam totalmente visíveis nas linhas de notebook da matriz canônica (1366×700 e 1440×900) e durante a redução gradual de 900px a 600px de altura — **bloqueado**: sem navegador disponível neste ambiente sandbox (sem `/opt/google/chrome`, instalação requer `sudo` indisponível); verificado estaticamente via CSS compilado (`dist/portfolio/browser/main-*.js`), confirmando os offsets corretos em cada breakpoint — validação visual real pendente, a ser feita manualmente pelo usuário

**Checkpoint**: User Story 1 (MVP) completa e validável de forma independente — o bug reportado nas capturas de tela está corrigido

---

## Phase 4: User Story 2 - Experiência consistente em toda a variedade de telas (Priority: P2)

**Goal**: Estender a mesma correção às demais seções públicas (Início, Blog, Contato) e confirmar consistência em toda a matriz de resoluções, incluindo monitores grandes

**Independent Test**: Ver [quickstart.md](./quickstart.md) — percorrer as 6 páginas públicas nas 8 dimensões da matriz canônica sem sobreposição, corte ou espaçamento quebrado

### Implementation for User Story 2

- [X] T011 [P] [US2] Corrigir a seção full-height em `src/app/core/components/home/home.scss`: aplicar o mixin de offset do header (T003), converter `height` fixo para `min-height` e adicionar as media queries de altura (T004)
- [X] T012 [P] [US2] Corrigir a seção full-height em `src/app/core/components/blog-preview/blog-preview.scss`: aplicar o mixin de offset do header (T003), converter `height` fixo para `min-height` e adicionar as media queries de altura (T004)
- [X] T013 [P] [US2] Corrigir a seção full-height em `src/app/core/components/contact/contact.scss`: aplicar o mixin de offset do header (T003), converter `height` fixo para `min-height` e adicionar as media queries de altura (T004)
- [X] T014 [US2] Revisar o comportamento em monitores grandes (≥1920px de largura) em `src/app/core/components/{home,about,projects,education,blog-preview,contact}/*.scss`, ajustando containers `max-width` para evitar espaço vazio excessivo ou elementos desproporcionais nas linhas 1920×1080 e 2560×1440 da matriz — revisado: todos os containers já usam `max-width` (1000–1440px) com centralização via flex nos wrappers full-height; nenhum ajuste adicional necessário
- [ ] T015 [US2] Validar manualmente a User Story 2 usando [quickstart.md](./quickstart.md): percorrer as 6 páginas públicas nas 8 dimensões da matriz canônica, confirmando ausência de sobreposição, corte de texto ou espaçamento quebrado — **bloqueado**: sem navegador disponível neste ambiente (ver nota em T010); validação visual real pendente

**Checkpoint**: User Stories 1 e 2 completas — todas as páginas públicas consistentes em toda a matriz de telas

---

## Phase 5: User Story 3 - Componentes interativos utilizáveis em qualquer tamanho de tela (Priority: P3)

**Goal**: Garantir que o carrossel de projetos e a lista de cartões de tecnologias permaneçam totalmente utilizáveis em qualquer tamanho de tela

**Independent Test**: Ver [quickstart.md](./quickstart.md) — em altura reduzida, testar as setas do carrossel e a rolagem da lista de stacks

### Implementation for User Story 3

- [X] T016 [P] [US3] Ajustar `src/app/core/components/project-carousel/project-carousel.scss` para que as setas de navegação (anterior/próximo) e indicadores permaneçam totalmente visíveis e clicáveis em seções com altura reduzida (~600–800px), corrigindo posicionamento/dimensionamento que hoje assume 100vh cheio
- [X] T017 [P] [US3] Ajustar `src/app/core/components/card-stacks/card-stacks.scss` para que ícones e texto dos cartões de tecnologia não sejam cortados em larguras estreitas ou seções de altura reduzida
- [ ] T018 [US3] Validar manualmente a User Story 3 usando [quickstart.md](./quickstart.md): confirmar que as setas do carrossel permanecem clicáveis e os cartões de stacks permanecem legíveis em toda a matriz canônica, especialmente nas linhas de notebook — **bloqueado**: sem navegador disponível neste ambiente (ver nota em T010); validação visual real pendente

**Checkpoint**: Todas as user stories completas — componentes interativos utilizáveis em qualquer tela

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Garantir qualidade e ausência de regressão em todas as mudanças

- [X] T019 [P] Rodar `npm run lint` e corrigir quaisquer violações nos arquivos alterados, conforme o gate de qualidade da constituição do projeto — **N/A**: projeto não tem ESLint configurado (sem script `lint`, sem devDependency `eslint`, sem arquivo de config); nada a rodar
- [X] T020 [P] Rodar `npm test` e confirmar que a suíte Vitest completa continua passando sem regressões em relação ao baseline de T002 — resultado idêntico ao baseline (5 failed / 6 passed; falhas pré-existentes não relacionadas a esta feature: `IntersectionObserver`/animações ausentes no ambiente de teste)
- [ ] T021 Executar a checklist completa de [quickstart.md](./quickstart.md) fim a fim (6 páginas × 8 dimensões da matriz + edge cases: janela de ~500px de altura, zoom do navegador 125%/150%, celular em paisagem) e registrar os resultados — **bloqueado**: sem navegador disponível neste ambiente (ver nota em T010); build e verificação estática do CSS compilado confirmam a lógica correta, mas a checklist visual real fica pendente para o usuário rodar `npm start` localmente e conferir
- [X] T022 Verificar que acessibilidade (navegação por teclado até os controles do carrossel e links do menu), `prefers-reduced-motion` e a consistência do dark theme foram preservados em todas as seções alteradas — revisão estática: nenhum HTML/TS foi alterado (só SCSS), `prefers-reduced-motion` só existe em `preloader.scss` (não tocado) e nenhuma cor foi alterada em nenhum arquivo

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende da conclusão do Setup — BLOQUEIA todas as user stories
- **User Story 1 (Phase 3)**: Depende apenas do Foundational — é o MVP
- **User Story 2 (Phase 4)**: Depende apenas do Foundational — pode rodar em paralelo com US1 se houver mais de uma pessoa, mas reaproveita o padrão que US1 valida primeiro
- **User Story 3 (Phase 5)**: Depende apenas do Foundational — ajustes em componentes filhos de "Sobre" (T017) e "Projetos" (T016), que fazem mais sentido após US1 corrigir os containers pais, mas não há dependência técnica direta
- **Polish (Phase 6)**: Depende da conclusão de todas as user stories desejadas

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após o Foundational — sem dependência de outras stories
- **User Story 2 (P2)**: Pode começar após o Foundational — reaproveita o mesmo mixin/breakpoints de US1, mas cada seção é um arquivo independente
- **User Story 3 (P3)**: Pode começar após o Foundational — componentes filhos (`project-carousel`, `card-stacks`) independentes dos containers pais alterados em US1

### Within Each User Story

- Correção do container full-height (offset + min-height) antes das media queries de altura específicas
- Validação manual (quickstart.md) é a última tarefa de cada fase

### Parallel Opportunities

- T001 e T002 podem rodar em paralelo (Setup)
- T005 pode rodar em paralelo com T003/T004 sendo escritos, mas depende do mixin existir para referenciá-lo — na prática, completar T003 antes de T005
- Dentro de US1: T006 e T007 são paralelos (arquivos diferentes); T008 e T009 são paralelos entre si (arquivos diferentes)
- Dentro de US2: T011, T012 e T013 são totalmente paralelos (arquivos diferentes)
- Dentro de US3: T016 e T017 são paralelos (arquivos diferentes)
- Após o Foundational, US1, US2 e US3 podem ser trabalhadas em paralelo por pessoas/agentes diferentes
- T019 e T020 (Polish) são paralelos entre si

---

## Parallel Example: User Story 1

```bash
# Lançar as correções dos dois containers full-height de US1 juntas:
Task: "Corrigir a seção .about em src/app/core/components/about/about.scss (offset do header + min-height)"
Task: "Corrigir a seção #projetos em src/app/core/components/projects/projects.scss (offset do header + min-height)"

# Depois, lançar as media queries de altura das duas seções juntas:
Task: "Adicionar media queries de altura em src/app/core/components/about/about.scss"
Task: "Adicionar media queries de altura em src/app/core/components/projects/projects.scss"
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloqueia todas as stories)
3. Completar Phase 3: User Story 1
4. **PARAR e VALIDAR**: testar "Sobre" e "Projetos" independentemente via quickstart.md
5. Fazer deploy/demo se estiver pronto — já resolve o bug reportado nas capturas de tela

### Incremental Delivery

1. Setup + Foundational → base pronta
2. User Story 1 → validar independentemente → deploy/demo (MVP — corrige o bug relatado)
3. User Story 2 → validar independentemente → deploy/demo (cobertura completa de telas)
4. User Story 3 → validar independentemente → deploy/demo (componentes interativos refinados)
5. Cada story agrega valor sem quebrar as anteriores

---

## Notes

- [P] = arquivos diferentes, sem dependências entre si
- [Story] mapeia a tarefa à user story correspondente para rastreabilidade
- Sem tarefas de teste automatizado novo: a verificação é visual/manual via quickstart.md, com a suíte Vitest existente como guarda de regressão (T020)
- Fazer commit após cada tarefa ou grupo lógico
- Parar em qualquer checkpoint para validar a story independentemente
- Evitar: ajustes vagos sem arquivo específico, conflitos no mesmo arquivo entre tarefas paralelas, dependências entre stories que quebrem a independência
