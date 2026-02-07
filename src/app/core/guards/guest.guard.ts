import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../api/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  const redirectPath = authService.isAdmin() ? '/dashboard' : '/dashboard/tickets';
  return router.createUrlTree([redirectPath]);
};
