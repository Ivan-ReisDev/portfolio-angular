import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../api/services/auth.service';
import { Resource, Action } from '../api/models/auth.model';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const resource = route.data['resource'] as Resource;
  const action = route.data['action'] as Action;

  const fallback = authService.isAdmin() ? '/dashboard' : '/dashboard/tickets';
  return !resource || !action || authService.hasPermission(resource, action)
    ? true
    : router.createUrlTree([fallback]);
};
