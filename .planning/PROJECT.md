# Portfolio - Seção de Projetos

## What This Is

Um portfólio pessoal de desenvolvedor em Angular 21 com foco na exibição de projetos. A seção de projetos apresenta um carousel interativo que leva a páginas individuais com detalhes completos, demos ao vivo e galeria de imagens.

## Core Value

**Mostrar projetos de forma visualmente atraente e profissional, permitindo que visitantes explorem cada trabalho em detalhes.**

## Requirements

### Validated

- ✓ Estrutura de portfólio com navegação por scroll-snap — existing
- ✓ Seções Home, Sobre, Educação com animações de entrada — existing
- ✓ Navbar com destaque da seção ativa — existing
- ✓ SSR com Express para SEO — existing
- ✓ Sistema de cards de tecnologias (CardStacks) — existing
- ✓ Dark theme com variáveis SCSS — existing

### Active

- [ ] Carousel de projetos na seção principal
- [ ] Cards com imagem, título, descrição, tags de tecnologias e links
- [ ] Página individual por projeto (rota dinâmica)
- [ ] Galeria de imagens na página do projeto
- [ ] Descrição completa do projeto
- [ ] Iframe com demo ao vivo (opcional por projeto)
- [ ] Lista de features do projeto
- [ ] Dados dos projetos em arquivo JSON
- [ ] Navegação entre projetos (anterior/próximo)

### Out of Scope

- CMS ou backend para gerenciar projetos — complexidade desnecessária para portfólio pessoal
- Blog funcional — foco apenas na seção de projetos por agora
- Formulário de contato — será implementado em milestone futuro
- Autenticação — não necessário para portfólio público

## Context

**Codebase existente:**
- Angular 21 standalone components (sem NgModules)
- Componente Carousel existe mas está vazio (`src/app/core/components/carousel/`)
- Rotas configuradas mas array vazio (`src/app/app.routes.ts`)
- Pasta `src/app/pages/` disponível para páginas de projeto
- Devicon já carregado para ícones de tecnologias
- Pattern de IntersectionObserver usado para animações

**Dados dos projetos:**
- Serão armazenados em `src/assets/data/projects.json`
- Estrutura flexível para 7+ projetos
- Campos: id, title, description, fullDescription, technologies, images, demoUrl, githubUrl, features, iframe

**Estilo visual:**
- Seguir o dark theme atual ($primary-black, $secondary-blue, $gray)
- Animações suaves consistentes com o resto do site
- Hover effects nos cards

## Constraints

- **Tech stack**: Angular 21, TypeScript, SCSS — já definido no projeto
- **Routing**: Usar @angular/router para páginas de projeto
- **SSR**: Manter compatibilidade com Express SSR existente
- **Bundle size**: Manter dentro dos budgets (500kB warning, 1MB error)
- **Performance**: Lazy loading para imagens da galeria

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Carousel custom em vez de biblioteca | Consistência visual, controle total, sem dependência externa | — Pending |
| JSON estático em vez de API | Simplicidade, não precisa de backend, fácil de editar | — Pending |
| Rotas dinâmicas para projetos | SEO-friendly, URLs limpas (/projeto/:id) | — Pending |
| Iframe opcional por projeto | Nem todo projeto tem demo hospedado | — Pending |

---
*Last updated: 2026-01-18 after initialization*
