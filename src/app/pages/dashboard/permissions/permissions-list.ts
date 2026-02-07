import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PermissionApiService } from '../../../core/api/services/permission-api.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { PermissionEntity } from '../../../core/api/models/permission.model';

interface PermissionGroup {
  resource: string;
  permissions: PermissionEntity[];
}

@Component({
  selector: 'app-permissions-list',
  imports: [],
  templateUrl: './permissions-list.html',
  styleUrl: './permissions-list.scss'
})
export class PermissionsList implements OnInit {
  private readonly permissionApi = inject(PermissionApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly groups = signal<PermissionGroup[]>([]);
  readonly totalCount = signal(0);

  ngOnInit(): void {
    this.loadPermissions();
  }

  private loadPermissions(): void {
    this.permissionApi
      .findAll(1, 50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.totalCount.set(response.meta.totalItems);
          this.groupPermissions(response.data);
          this.loading.set(false);
        },
        error: () => {
          this.toast.error('Erro ao carregar permissões.');
          this.loading.set(false);
        }
      });
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      create: 'fa-solid fa-plus',
      read: 'fa-solid fa-eye',
      update: 'fa-solid fa-pen',
      delete: 'fa-solid fa-trash-can'
    };
    return icons[action] ?? 'fa-solid fa-circle';
  }

  private groupPermissions(permissions: PermissionEntity[]): void {
    const grouped = new Map<string, PermissionEntity[]>();
    permissions.forEach((p) => {
      const list = grouped.get(p.resource) ?? [];
      list.push(p);
      grouped.set(p.resource, list);
    });
    this.groups.set(
      Array.from(grouped.entries()).map(([resource, perms]) => ({
        resource,
        permissions: perms
      }))
    );
  }
}
