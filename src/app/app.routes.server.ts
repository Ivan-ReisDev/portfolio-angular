import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projeto/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      try {
        const fs = await import('node:fs/promises');
        const path = await import('node:path');
        const filePath = path.join(process.cwd(), 'public', 'data', 'projects.json');
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8')) as { projects: { id: string }[] };
        return data.projects.map((p) => ({ slug: p.id }));
      } catch (error: unknown) {
        console.error('Não foi possível carregar os projetos para o prerender.', error);
        return [];
      }
    },
    fallback: PrerenderFallback.Server
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      try {
        const fs = await import('node:fs/promises');
        const path = await import('node:path');
        const filePath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8')) as { posts: { slug: string }[] };
        return data.posts.map((p) => ({ slug: p.slug }));
      } catch (error: unknown) {
        console.error('Não foi possível carregar os posts para o prerender.', error);
        return [];
      }
    },
    fallback: PrerenderFallback.Server
  },
  {
    path: 'login',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
