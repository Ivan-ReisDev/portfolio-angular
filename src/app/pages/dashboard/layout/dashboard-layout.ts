import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

import { AuthService } from '../../../core/api/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  resource?: string;
  action?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly sidebarOpen = signal(false);
  readonly adminMenuExpanded = signal(false);

  readonly currentUser = this.authService.currentUser;
  readonly userRole = this.authService.userRole;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fa-solid fa-chart-line', route: '/dashboard' },
    { label: 'Contatos', icon: 'fa-solid fa-address-book', route: '/dashboard/contacts', resource: 'contacts', action: 'read' },
    { label: 'Tickets', icon: 'fa-solid fa-ticket', route: '/dashboard/tickets', resource: 'tickets', action: 'read' },
    { label: 'Faturas', icon: 'fa-solid fa-file-invoice-dollar', route: '/dashboard/invoices', resource: 'invoices', action: 'read' },
    { 
      label: 'Administração', 
      icon: 'fa-solid fa-user-shield',
      children: [
        { label: 'Usuários', icon: 'fa-solid fa-users', route: '/dashboard/users', resource: 'users', action: 'read' },
        { label: 'Roles', icon: 'fa-solid fa-shield-halved', route: '/dashboard/roles', resource: 'roles', action: 'read' },
        { label: 'Permissões', icon: 'fa-solid fa-key', route: '/dashboard/permissions', resource: 'permissions', action: 'read' }
      ]
    }
  ];

  get visibleNavItems(): NavItem[] {
    const isAdmin = this.authService.isAdmin();
    
    return this.navItems.map(item => {
      if (item.children) {
        // For parent items (Admin), checking if user should see the parent
        // In this case, "Administração" is only for admins
        if (!isAdmin) return null;
        return item; // Start with children intact
      }
      
      // Regular items permissions check
      if (!item.resource || !item.action) return item;
      if (isAdmin) return item;
      return this.authService.hasPermission(item.resource as any, item.action as any) ? item : null;
    }).filter(Boolean) as NavItem[];
  }

  toggleAdminMenu(): void {
    this.adminMenuExpanded.update(v => !v);
  }

  get userInitials(): string {
    const email = this.currentUser()?.email ?? '';
    return email.substring(0, 2).toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  isExactRoute(route: string): boolean {
    return this.router.url === route;
  }
}
