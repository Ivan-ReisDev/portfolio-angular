import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { UserApiService } from '../../../core/api/services/user-api.service';
import { RoleApiService } from '../../../core/api/services/role-api.service';
import { AuthService } from '../../../core/api/services/auth.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { Modal } from '../../../core/components/dashboard/modal/modal';
import { ConfirmDialog } from '../../../core/components/dashboard/confirm-dialog/confirm-dialog';
import { User } from '../../../core/api/models/user.model';
import { Role } from '../../../core/api/models/role.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

@Component({
  selector: 'app-users-list',
  imports: [DatePipe, ReactiveFormsModule, Modal, ConfirmDialog],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList implements OnInit {
  private readonly userApi = inject(UserApiService);
  private readonly roleApi = inject(RoleApiService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly currentPage = signal(1);

  readonly showFormModal = signal(false);
  readonly editingUser = signal<User | null>(null);
  readonly submitting = signal(false);

  readonly showDeleteConfirm = signal(false);
  readonly deletingUser = signal<User | null>(null);
  readonly deleting = signal(false);

  readonly canCreate = this.authService.hasPermission('users', 'create');
  readonly canUpdate = this.authService.hasPermission('users', 'update');
  readonly canDelete = this.authService.hasPermission('users', 'delete');

  readonly userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleId: ['', [Validators.required]]
  });

  get isEditing(): boolean {
    return this.editingUser() !== null;
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.userApi
      .findAll(page, 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.users.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: () => {
          this.toast.error('Erro ao carregar usuários.');
          this.loading.set(false);
        }
      });
  }

  private loadRoles(): void {
    this.roleApi
      .findAll(1, 50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.roles.set(response.data),
        error: () => {}
      });
  }

  openCreateModal(): void {
    this.editingUser.set(null);
    this.userForm.reset();
    this.userForm.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.controls.password.updateValueAndValidity();
    this.showFormModal.set(true);
  }

  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      roleId: user.role.id
    });
    this.userForm.controls.password.clearValidators();
    this.userForm.controls.password.setValidators([Validators.minLength(6)]);
    this.userForm.controls.password.updateValueAndValidity();
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.editingUser.set(null);
    this.userForm.reset();
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const values = this.userForm.getRawValue();

    if (this.isEditing) {
      const payload: any = { name: values.name, email: values.email, roleId: values.roleId };
      if (values.password) payload.password = values.password;

      this.userApi
        .update(this.editingUser()!.id, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.success('Usuário atualizado com sucesso.');
            this.submitting.set(false);
            this.closeFormModal();
            this.loadUsers(this.currentPage());
          },
          error: () => {
            this.toast.error('Erro ao atualizar usuário.');
            this.submitting.set(false);
          }
        });
    } else {
      this.userApi
        .create(values)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.success('Usuário criado com sucesso.');
            this.submitting.set(false);
            this.closeFormModal();
            this.loadUsers(this.currentPage());
          },
          error: () => {
            this.toast.error('Erro ao criar usuário.');
            this.submitting.set(false);
          }
        });
    }
  }

  confirmDelete(user: User): void {
    this.deletingUser.set(user);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingUser.set(null);
  }

  deleteUser(): void {
    const user = this.deletingUser();
    if (!user) return;

    this.deleting.set(true);

    this.userApi
      .delete(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Usuário removido com sucesso.');
          this.deleting.set(false);
          this.showDeleteConfirm.set(false);
          this.deletingUser.set(null);
          this.loadUsers(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao remover usuário.');
          this.deleting.set(false);
        }
      });
  }

  get pages(): number[] {
    const totalPages = this.meta()?.totalPages ?? 0;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
