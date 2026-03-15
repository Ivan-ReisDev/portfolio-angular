import { Component, inject } from '@angular/core';

import { AuthService } from '../../../core/api/services/auth.service';
import { InvoicesAdmin } from './invoices-admin';
import { InvoicesUser } from './invoices-user';

@Component({
  selector: 'app-invoices-page',
  imports: [InvoicesAdmin, InvoicesUser],
  template: `
    @if (isAdmin) {
      <app-invoices-admin />
    } @else {
      <app-invoices-user />
    }
  `
})
export class InvoicesPage {
  private readonly authService = inject(AuthService);

  readonly isAdmin = this.authService.isAdmin();
}
