import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { permissionGuard } from './core/guards/permission.guard';

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
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog-list')
      .then(m => m.BlogList),
    title: 'Blog'
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog/blog-post')
      .then(m => m.BlogPost),
    title: 'Blog Post'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login')
      .then(m => m.Login),
    title: 'Login',
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/layout/dashboard-layout')
      .then(m => m.DashboardLayout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/home/dashboard-home')
          .then(m => m.DashboardHome),
        title: 'Dashboard',
        canActivate: [adminGuard]
      },
      {
        path: 'contacts',
        loadComponent: () => import('./pages/dashboard/contacts/contacts-list')
          .then(m => m.ContactsList),
        title: 'Contatos',
        canActivate: [permissionGuard],
        data: { resource: 'contacts', action: 'read' }
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/dashboard/users/users-list')
          .then(m => m.UsersList),
        title: 'Usuários',
        canActivate: [permissionGuard],
        data: { resource: 'users', action: 'read' }
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/dashboard/roles/roles-list')
          .then(m => m.RolesList),
        title: 'Roles',
        canActivate: [permissionGuard],
        data: { resource: 'roles', action: 'read' }
      },
      {
        path: 'permissions',
        loadComponent: () => import('./pages/dashboard/permissions/permissions-list')
          .then(m => m.PermissionsList),
        title: 'Permissões',
        canActivate: [permissionGuard],
        data: { resource: 'permissions', action: 'read' }
      },
      {
        path: 'tickets',
        loadComponent: () => import('./pages/dashboard/tickets/tickets-page')
          .then(m => m.TicketsPage),
        title: 'Tickets',
        canActivate: [permissionGuard],
        data: { resource: 'tickets', action: 'read' }
      }
    ]
  }
];
