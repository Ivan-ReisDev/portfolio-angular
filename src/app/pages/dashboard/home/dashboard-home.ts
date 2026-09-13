import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';

import { AuthService } from '../../../core/api/services/auth.service';
import { ContactApiService } from '../../../core/api/services/contact-api.service';
import { UserApiService } from '../../../core/api/services/user-api.service';
import { RoleApiService } from '../../../core/api/services/role-api.service';
import { TicketApiService } from '../../../core/api/services/ticket-api.service';
import { Contact } from '../../../core/api/models/contact.model';
import { PaginatedResponse } from '../../../core/api/models/api-response.model';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  route: string;
  color: string;
}

type DashboardResponse = PaginatedResponse<unknown>;
type DashboardRequests = Partial<Record<'contacts' | 'users' | 'roles' | 'tickets', Observable<DashboardResponse>>>;
type DashboardResults = Partial<Record<'contacts' | 'users' | 'roles' | 'tickets', DashboardResponse>>;
type DashboardKey = keyof DashboardRequests;

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
    const requests = this.getDashboardRequests();
    if (Object.keys(requests).length === 0) {
      this.loading.set(false);
      return;
    }

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          const cards: StatCard[] = [];
          const dashboardResults = results as DashboardResults;
          this.appendDashboardCard(cards, dashboardResults.contacts, { label: 'Contatos', icon: 'fa-solid fa-address-book', route: '/dashboard/contacts', color: '#43a3be' }, data => this.recentContacts.set(data as Contact[]));
          this.appendDashboardCard(cards, dashboardResults.users, { label: 'Usuários', icon: 'fa-solid fa-users', route: '/dashboard/users', color: '#6432c8' });
          this.appendDashboardCard(cards, dashboardResults.roles, { label: 'Roles', icon: 'fa-solid fa-shield-halved', route: '/dashboard/roles', color: '#2ecc71' });
          this.appendDashboardCard(cards, dashboardResults.tickets, { label: 'Tickets', icon: 'fa-solid fa-ticket', route: '/dashboard/tickets', color: '#e67e22' });
          this.stats.set(cards);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  private getDashboardRequests(): DashboardRequests {
    const requests: DashboardRequests = {};
    this.addRequest(requests, 'contacts', 'contacts', this.contactApi.findAll(1, 5));
    this.addRequest(requests, 'users', 'users', this.userApi.findAll(1, 1));
    this.addRequest(requests, 'roles', 'roles', this.roleApi.findAll(1, 1));
    this.addRequest(requests, 'tickets', 'tickets', this.ticketApi.findAll(1, 1));
    return requests;
  }

  private addRequest(requests: DashboardRequests, key: DashboardKey, resource: 'contacts' | 'users' | 'roles' | 'tickets', request: Observable<DashboardResponse>): void {
    if (this.authService.hasPermission(resource, 'read')) requests[key] = request;
  }

  private appendDashboardCard(
    cards: StatCard[],
    response: DashboardResponse | undefined,
    card: Omit<StatCard, 'value'>,
    onData?: (data: unknown[]) => void
  ): void {
    if (!response) return;
    cards.push({ ...card, value: response.meta.totalItems });
    onData?.(response.data);
  }
}
