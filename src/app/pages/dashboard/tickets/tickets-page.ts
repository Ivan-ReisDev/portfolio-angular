import { Component, inject } from '@angular/core';

import { AuthService } from '../../../core/api/services/auth.service';
import { TicketsAdmin } from './tickets-admin';
import { TicketsUser } from './tickets-user';

@Component({
  selector: 'app-tickets-page',
  imports: [TicketsAdmin, TicketsUser],
  template: `
    @if (isAdmin) {
      <app-tickets-admin />
    } @else {
      <app-tickets-user />
    }
  `
})
export class TicketsPage {
  private readonly authService = inject(AuthService);

  readonly isAdmin = this.authService.isAdmin();
}
