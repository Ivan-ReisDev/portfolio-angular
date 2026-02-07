import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { RoleApiService } from '../../../core/api/services/role-api.service';
import { PermissionApiService } from '../../../core/api/services/permission-api.service';
import { AuthService } from '../../../core/api/services/auth.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { Modal } from '../../../core/components/dashboard/modal/modal';
import { ConfirmDialog } from '../../../core/components/dashboard/confirm-dialog/confirm-dialog';
import { Role } from '../../../core/api/models/role.model';
import { PermissionEntity } from '../../../core/api/models/permission.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

interface PermissionGroup {
  resource: string;
  permissions: PermissionEntity[];
}

@Component({
  selector: 'app-roles-list',
  imports: [DatePipe, ReactiveFormsModule, Modal, ConfirmDialog],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss'
})
export class RolesList implements OnInit {
  private readonly roleApi = inject(RoleApiService);
  private readonly permissionApi = inject(PermissionApiService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly roles = signal<Role[]>([]);
  readonly allPermissions = signal<PermissionEntity[]>([]);
  readonly permissionGroups = signal<PermissionGroup[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly currentPage = signal(1);

  readonly showFormModal = signal(false);
  readonly editingRole = signal<Role | null>(null);
  readonly submitting = signal(false);
  readonly selectedPermissionIds = signal<Set<string>>(new Set());

  readonly showDeleteConfirm = signal(false);
  readonly deletingRole = signal<Role | null>(null);
  readonly deleting = signal(false);

  readonly canCreate = this.authService.hasPermission('roles', 'create');
  readonly canUpdate = this.authService.hasPermission('roles', 'update');
  readonly canDelete = this.authService.hasPermission('roles', 'delete');

  readonly roleForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]]
  });

  get isEditing(): boolean {
    return this.editingRole() !== null;
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.roleApi
      .findAll(page, 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.roles.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: () => {
          this.toast.error('Erro ao carregar roles.');
          this.loading.set(false);
        }
      });
  }

  private loadPermissions(): void {
    this.permissionApi
      .findAll(1, 50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.allPermissions.set(response.data);
          this.groupPermissions(response.data);
        },
        error: () => {}
      });
  }

  private groupPermissions(permissions: PermissionEntity[]): void {
    const grouped = new Map<string, PermissionEntity[]>();
    permissions.forEach((p) => {
      const list = grouped.get(p.resource) ?? [];
      list.push(p);
      grouped.set(p.resource, list);
    });
    this.permissionGroups.set(
      Array.from(grouped.entries()).map(([resource, perms]) => ({
        resource,
        permissions: perms
      }))
    );
  }

  togglePermission(id: string): void {
    this.selectedPermissionIds.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isPermissionSelected(id: string): boolean {
    return this.selectedPermissionIds().has(id);
  }

  openCreateModal(): void {
    this.editingRole.set(null);
    this.roleForm.reset();
    this.selectedPermissionIds.set(new Set());
    this.showFormModal.set(true);
  }

  openEditModal(role: Role): void {
    this.editingRole.set(role);
    this.roleForm.patchValue({ name: role.name });
    this.selectedPermissionIds.set(new Set(role.permissions.map((p) => p.id)));
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.editingRole.set(null);
    this.roleForm.reset();
    this.selectedPermissionIds.set(new Set());
  }

  submitForm(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const name = this.roleForm.getRawValue().name;
    const permissionIds = Array.from(this.selectedPermissionIds());

    if (this.isEditing) {
      this.roleApi
        .update(this.editingRole()!.id, { name, permissionIds })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.success('Role atualizada com sucesso.');
            this.submitting.set(false);
            this.closeFormModal();
            this.loadRoles(this.currentPage());
          },
          error: () => {
            this.toast.error('Erro ao atualizar role.');
            this.submitting.set(false);
          }
        });
    } else {
      this.roleApi
        .create({ name, permissionIds })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.success('Role criada com sucesso.');
            this.submitting.set(false);
            this.closeFormModal();
            this.loadRoles(this.currentPage());
          },
          error: () => {
            this.toast.error('Erro ao criar role.');
            this.submitting.set(false);
          }
        });
    }
  }

  confirmDelete(role: Role): void {
    this.deletingRole.set(role);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingRole.set(null);
  }

  deleteRole(): void {
    const role = this.deletingRole();
    if (!role) return;

    this.deleting.set(true);

    this.roleApi
      .delete(role.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Role removida com sucesso.');
          this.deleting.set(false);
          this.showDeleteConfirm.set(false);
          this.deletingRole.set(null);
          this.loadRoles(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao remover role.');
          this.deleting.set(false);
        }
      });
  }

  get pages(): number[] {
    const totalPages = this.meta()?.totalPages ?? 0;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
