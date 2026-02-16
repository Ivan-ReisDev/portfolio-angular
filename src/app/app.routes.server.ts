import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projeto/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'projects.json');
      const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      return data.projects.map((p: { id: string }) => ({ slug: p.id }));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
      const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      return data.posts.map((p: { slug: string }) => ({ slug: p.slug }));
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
