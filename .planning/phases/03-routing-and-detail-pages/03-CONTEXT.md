# Phase 3: Routing and Detail Pages - Context

**Gathered:** 2026-01-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Criar páginas individuais de projeto com URL própria, galeria de imagens, navegação entre projetos, e configuração de SSR prerendering. O foco é na experiência de visualização detalhada de cada projeto.

</domain>

<decisions>
## Implementation Decisions

### Padrão de abertura
- Navegação completa (nova página), não overlay
- URL no formato `/projeto/:slug` (português, slug legível)
- Ao voltar, retornar para a seção Projects (scroll automático)

### Layout da página de detalhe
- Layout de duas colunas (desktop)
- Conteúdo completo: título, descrição longa, tecnologias, links, data, status, galeria
- Demo interativa: botão "Ver demo" que abre iframe em modal/fullscreen

### Galeria de imagens
- Imagem principal grande + thumbnails abaixo para navegação
- Clique na imagem abre lightbox fullscreen
- Lightbox com navegação: setas + swipe
- Indicador de posição: contador "2 de 5"

### Navegação entre projetos
- Posição: rodapé da página de detalhe
- Exibição: título + thumbnail do projeto anterior/próximo
- Navegação circular (do último volta pro primeiro)
- Ordem: por data (projetos mais recentes primeiro)

### Claude's Discretion
- Transição visual ao navegar para/da página de detalhe
- Distribuição das colunas (galeria esquerda ou direita)
- Comportamento mobile (ordem de empilhamento das colunas)
- Design do modal de demo interativa
- Estilo visual do lightbox

</decisions>

<specifics>
## Specific Ideas

- Manter consistência visual com o glassmorphism e tema escuro já estabelecidos no portfolio
- Thumbnails devem indicar claramente qual está selecionado
- Lightbox deve ter botão de fechar visível e permitir fechar com ESC ou clique fora

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-routing-and-detail-pages*
*Context gathered: 2026-01-18*
