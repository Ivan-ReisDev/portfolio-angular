import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../core/api/services/auth.service';
import { ContactApiService } from '../../../core/api/services/contact-api.service';
import { UserApiService } from '../../../core/api/services/user-api.service';
import { RoleApiService } from '../../../core/api/services/role-api.service';
import { TicketApiService } from '../../../core/api/services/ticket-api.service';
import { Contact } from '../../../core/api/models/contact.model';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-home',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHome implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly contactApi = inject(ContactApiService);
  private readonly userApi = inject(UserApiService);
  private readonly roleApi = inject(RoleApiService);
  private readonly ticketApi = inject(TicketApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly stats = signal<StatCard[]>([]);
  readonly recentContacts = signal<Contact[]>([]);
  readonly userName = this.authService.currentUser;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const requests: Record<string, any> = {};

    if (this.authService.hasPermission('contacts', 'read')) {
      requests['contacts'] = this.contactApi.findAll(1, 5);
    }
    if (this.authService.hasPermission('users', 'read')) {
      requests['users'] = this.userApi.findAll(1, 1);
    }
    if (this.authService.hasPermission('roles', 'read')) {
      requests['roles'] = this.roleApi.findAll(1, 1);
    }
    if (this.authService.hasPermission('tickets', 'read')) {
      requests['tickets'] = this.ticketApi.findAll(1, 1);
    }

    if (Object.keys(requests).length === 0) {
      this.loading.set(false);
      return;
    }

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results: any) => {
          const cards: StatCard[] = [];

          if (results['contacts']) {
            cards.push({
              label: 'Contatos',
              value: results['contacts'].meta.totalItems,
              icon: 'fa-solid fa-address-book',
              route: '/dashboard/contacts',
              color: '#43a3be'
            });
            this.recentContacts.set(results['contacts'].data);
          }

          if (results['users']) {
            cards.push({
              label: 'Usuários',
              value: results['users'].meta.totalItems,
              icon: 'fa-solid fa-users',
              route: '/dashboard/users',
              color: '#6432c8'
            });
          }

          if (results['roles']) {
            cards.push({
              label: 'Roles',
              value: results['roles'].meta.totalItems,
              icon: 'fa-solid fa-shield-halved',
              route: '/dashboard/roles',
              color: '#2ecc71'
            });
          }

          if (results['tickets']) {
            cards.push({
              label: 'Tickets',
              value: results['tickets'].meta.totalItems,
              icon: 'fa-solid fa-ticket',
              route: '/dashboard/tickets',
              color: '#e67e22'
            });
          }

          this.stats.set(cards);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }
}
