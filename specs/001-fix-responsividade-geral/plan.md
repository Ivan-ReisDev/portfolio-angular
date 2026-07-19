# Implementation Plan: Correção Geral de Responsividade

**Branch**: `001-fix-responsividade-geral` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-fix-responsividade-geral/spec.md`

## Summary

O portfólio usa seções de página inteira (`height: 100vh`/`100dvh`, `position:
sticky`, conteúdo centralizado verticalmente) sob um header fixo (`position:
fixed`, ~80px de altura + margem de topo). Como o offset do header não é
reservado de forma consistente em todas as seções — hoje só `education.scss`
compensa isso com `padding-top: 100px`, enquanto `about.scss`, `projects.scss`
e as demais seções não compensam — o título e o conteúdo centralizado ficam
atrás do header sempre que a altura da viewport diminui (notebooks de tela
menor, celular em paisagem, zoom do navegador). A abordagem técnica é
substituir essa compensação ad hoc e inconsistente por um mecanismo
compartilhado (mixin/variável CSS) aplicado a todas as seções full-height do
portfólio público, combinado com unidades de viewport mais robustas
(`dvh`/`svh`) e `min-height` (em vez de `height` fixo) para permitir rolagem
interna em vez de corte de conteúdo em alturas extremas.

## Technical Context

**Language/Version**: TypeScript ~5.9 (strict mode), Angular 21 (standalone components)

**Primary Dependencies**: Angular CDK, SCSS (sem framework CSS externo), `@tsparticles/angular` (efeito visual de fundo, não afetado por esta correção)

**Storage**: N/A (correção é puramente de layout/apresentação, sem dados)

**Testing**: Vitest para specs de comportamento de componente já existentes (ex.: `navbar.spec.ts`); esta correção é majoritariamente CSS/template e não introduz lógica nova testável por unidade — a verificação principal é visual, na matriz de resoluções canônica documentada em `quickstart.md`

**Target Platform**: Navegadores web modernos (desktop e mobile), com SSR via Angular Express

**Project Type**: Aplicação web única (Angular standalone) — site de portfólio público

**Performance Goals**: Nenhuma regressão de performance; a correção é CSS/estrutural e não deve adicionar JavaScript de runtime (ex.: sem listeners de `resize`/`ResizeObserver` para recalcular offsets)

**Constraints**: Não alterar o comportamento do header fixo em si (apenas o espaço reservado abaixo dele); manter compatibilidade com largura mínima de 320px; preservar a identidade visual (dark theme, glassmorphism, animações) já estabelecida; escopo restrito às páginas públicas (ver Clarifications no spec — Dashboard/Login fora de escopo)

**Scale/Scope**: 6 seções/páginas públicas (Início, Sobre, Projetos, Progresso, Blog, Contato) mais os componentes compartilhados que definem o espaçamento full-height (Header/Navbar e o mixin/estilo base em `app.scss`/`styles.scss`); ~6-8 arquivos `.scss` afetados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|---|---|---|
| I. Single Responsibility & Standalone Components | Nenhum componente muda de responsabilidade; apenas estilos/templates são ajustados. `OnPush` já em uso nos componentes afetados e permanece inalterado. | PASS |
| II. Domain-Driven Structure | Correção é puramente de apresentação (SCSS/HTML), não introduz nem altera lógica de domínio em `core/services`/`core/models`. | PASS |
| III. Component Reuse & Composition (DRY/OCP) | **Requisito de design**: a correção DEVE extrair um mecanismo único e reutilizável (mixin SCSS ou custom property) para o offset do header full-height, em vez de repetir `padding-top` mágico por componente (estado atual inconsistente é o que causa o bug). Isso é tratado como gate de design na Fase 1, não como violação. | PASS (com requisito de design) |
| IV. Reactive State com Signals & DI | Não há novo estado reativo; nenhuma mudança em serviços ou injeção de dependência. | PASS (N/A) |
| V. Test-Discipline | Não há lógica nova para cobrir com Vitest; specs existentes (`navbar.spec.ts`, etc.) devem continuar passando como guarda de regressão. Verificação funcional desta feature é visual (matriz de telas), documentada em `quickstart.md`. | PASS (verificação visual documentada, não testes unitários novos) |
| VI. Clean, Self-Documenting, Strict TypeScript | Mudança é majoritariamente SCSS/HTML; qualquer ajuste em `.ts` (se necessário) segue strict mode, sem comentários explicativos de "o quê", apenas nomes descritivos. | PASS |

Nenhuma violação sem justificativa — **Complexity Tracking não se aplica** (tabela omitida).

**Re-check pós-Fase 1**: O design em [research.md](./research.md) confirma o
requisito do Princípio III — a Fase 0 decidiu extrair um mixin/variável CSS
compartilhada para o offset do header (item 2 do research.md), em vez de
repetir valores mágicos por componente. Nenhum novo princípio foi violado
pelo design; todos os status acima permanecem PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-responsividade-geral/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan) — guia de validação visual
├── checklists/
│   └── requirements.md  # Checklist de qualidade da spec
└── tasks.md              # Fase 2 (/speckit-tasks) — ainda não gerado
```

`data-model.md` e `/contracts/` foram omitidos intencionalmente: a spec não
define nenhuma entidade de dados (seção "Key Entities" explicitamente
omitida) e a feature não expõe nenhuma interface/contrato externo (é uma
correção de layout em uma aplicação web pública, sem API nova).

### Source Code (repository root)

```text
src/
├── styles.scss                              # Estilos globais / tokens de design
├── app/
│   ├── app.scss                             # Mixins compartilhados (premium-background, section-content-glass)
│   ├── app.html                             # Composição das seções da home (scroll-container)
│   └── core/
│       └── components/
│           ├── header/                      # Header fixo (fonte do offset a ser reservado)
│           │   ├── header.scss
│           │   └── header.ts
│           ├── navbar/                      # Navegação dentro do header
│           ├── home/                        # Seção "Início"
│           ├── about/                       # Seção "Sobre" (P1 — bug reportado)
│           ├── projects/                    # Seção "Projetos" (P1 — bug reportado)
│           │   └── projects.scss
│           ├── card-stacks/                 # Cartões de tecnologias dentro de "Sobre"
│           ├── project-carousel/            # Carrossel de projetos dentro de "Projetos"
│           ├── education/                   # Seção "Progresso" (já compensa o header — referência de padrão correto)
│           ├── blog-preview/                # Seção "Blog" (preview na home)
│           └── contact/                     # Seção "Contato"
└── ...
```

**Structure Decision**: Aplicação Angular única e já existente (não um
monorepo com frontend/backend separados) — a correção acontece inteiramente
dentro de `src/app/core/components/*` (seções da home) e nos estilos
compartilhados (`src/app/app.scss`, `src/styles.scss`). Nenhuma nova pasta ou
módulo é criado; o trabalho é consolidar o padrão de offset do header (hoje
correto apenas em `education/education.scss`) em um mixin/variável
compartilhada e aplicá-lo consistentemente às demais seções full-height.

## Complexity Tracking

> Não aplicável — nenhuma violação de constituição identificada nesta fase.
