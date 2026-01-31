import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    children: []
  },
  {
    path: 'projeto/:slug',
    loadComponent: () => import('./pages/project-detail/project-detail')
      .then(m => m.ProjectDetail),
    title: 'Projeto'
  }
];
