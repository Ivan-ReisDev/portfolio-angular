import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projeto/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      // Read project IDs directly from filesystem at build time
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'projects.json');
      const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      return data.projects.map((p: { id: string }) => ({ slug: p.id }));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
