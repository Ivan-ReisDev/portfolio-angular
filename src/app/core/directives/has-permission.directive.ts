import { Directive, inject, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';

import { AuthService } from '../api/services/auth.service';
import { Resource, Action } from '../api/models/auth.model';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  readonly appHasPermission = input.required<`${Resource}:${Action}`>();

  private hasView = false;

  constructor() {
    effect(() => {
      const permission = this.appHasPermission();
      const [resource, action] = permission.split(':') as [Resource, Action];
      const allowed = this.authService.hasPermission(resource, action);

      if (allowed && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!allowed && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
