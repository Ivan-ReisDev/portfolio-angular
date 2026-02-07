import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

import { ContactApiService } from '../../../core/api/services/contact-api.service';
import { AuthService } from '../../../core/api/services/auth.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { Modal } from '../../../core/components/dashboard/modal/modal';
import { ConfirmDialog } from '../../../core/components/dashboard/confirm-dialog/confirm-dialog';
import { Contact } from '../../../core/api/models/contact.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

@Component({
  selector: 'app-contacts-list',
  imports: [DatePipe, Modal, ConfirmDialog],
  templateUrl: './contacts-list.html',
  styleUrl: './contacts-list.scss'
})
export class ContactsList implements OnInit {
  private readonly contactApi = inject(ContactApiService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly contacts = signal<Contact[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly currentPage = signal(1);

  readonly selectedContact = signal<Contact | null>(null);
  readonly showDetailModal = signal(false);
  readonly showDeleteConfirm = signal(false);
  readonly deleting = signal(false);

  readonly canUpdate = this.authService.hasPermission('contacts', 'update');
  readonly canDelete = this.authService.hasPermission('contacts', 'delete');

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.contactApi
      .findAll(page, 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.contacts.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: () => {
          this.toast.error('Erro ao carregar contatos.');
          this.loading.set(false);
        }
      });
  }

  viewContact(contact: Contact): void {
    this.selectedContact.set(contact);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedContact.set(null);
  }

  confirmDelete(contact: Contact): void {
    this.selectedContact.set(contact);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.selectedContact.set(null);
  }

  deleteContact(): void {
    const contact = this.selectedContact();
    if (!contact) return;

    this.deleting.set(true);

    this.contactApi
      .delete(contact.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Contato removido com sucesso.');
          this.deleting.set(false);
          this.showDeleteConfirm.set(false);
          this.selectedContact.set(null);
          this.loadContacts(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao remover contato.');
          this.deleting.set(false);
        }
      });
  }

  get pages(): number[] {
    const totalPages = this.meta()?.totalPages ?? 0;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
