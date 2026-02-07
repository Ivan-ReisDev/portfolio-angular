import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { TicketApiService } from '../../../core/api/services/ticket-api.service';
import { AuthService } from '../../../core/api/services/auth.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { Modal } from '../../../core/components/dashboard/modal/modal';
import { ConfirmDialog } from '../../../core/components/dashboard/confirm-dialog/confirm-dialog';
import { Ticket, TicketPriority, TicketStatus } from '../../../core/api/models/ticket.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

@Component({
  selector: 'app-tickets-admin',
  imports: [DatePipe, ReactiveFormsModule, Modal, ConfirmDialog],
  templateUrl: './tickets-admin.html',
  styleUrl: './tickets-admin.scss'
})
export class TicketsAdmin implements OnInit {
  private readonly ticketApi = inject(TicketApiService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly tickets = signal<Ticket[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly currentPage = signal(1);

  readonly showEditModal = signal(false);
  readonly editingTicket = signal<Ticket | null>(null);
  readonly submitting = signal(false);

  readonly showDetailModal = signal(false);
  readonly selectedTicket = signal<Ticket | null>(null);

  readonly showDeleteConfirm = signal(false);
  readonly deletingTicket = signal<Ticket | null>(null);
  readonly deleting = signal(false);

  readonly canUpdate = this.authService.hasPermission('tickets', 'update');
  readonly canDelete = this.authService.hasPermission('tickets', 'delete');

  readonly editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    priority: ['medium' as TicketPriority],
    status: ['open' as TicketStatus],
    links: this.fb.array<string>([])
  });

  get editLinksArray(): FormArray {
    return this.editForm.controls.links;
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.ticketApi
      .findAll(page, 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.tickets.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: () => {
          this.toast.error('Erro ao carregar tickets.');
          this.loading.set(false);
        }
      });
  }

  viewTicket(ticket: Ticket): void {
    this.selectedTicket.set(ticket);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedTicket.set(null);
  }

  openEditModal(ticket: Ticket): void {
    this.editingTicket.set(ticket);
    this.editLinksArray.clear();

    this.editForm.patchValue({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status
    });

    if (ticket.links) {
      ticket.links.forEach((link) => {
        this.editLinksArray.push(this.fb.nonNullable.control(link, Validators.required));
      });
    }

    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingTicket.set(null);
    this.editForm.reset();
    this.editLinksArray.clear();
  }

  addEditLink(): void {
    this.editLinksArray.push(this.fb.nonNullable.control('', Validators.required));
  }

  removeEditLink(index: number): void {
    this.editLinksArray.removeAt(index);
  }

  submitEditForm(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const ticket = this.editingTicket();
    if (!ticket) return;

    this.submitting.set(true);
    const values = this.editForm.getRawValue();
    const links = values.links
      .filter((l): l is string => typeof l === 'string' && l.trim().length > 0);

    this.ticketApi
      .update(ticket.id, {
        title: values.title,
        description: values.description,
        priority: values.priority as TicketPriority,
        status: values.status as TicketStatus,
        links
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Ticket atualizado com sucesso.');
          this.submitting.set(false);
          this.closeEditModal();
          this.loadTickets(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao atualizar ticket.');
          this.submitting.set(false);
        }
      });
  }

  confirmDelete(ticket: Ticket): void {
    this.deletingTicket.set(ticket);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingTicket.set(null);
  }

  deleteTicket(): void {
    const ticket = this.deletingTicket();
    if (!ticket) return;

    this.deleting.set(true);

    this.ticketApi
      .delete(ticket.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Ticket removido com sucesso.');
          this.deleting.set(false);
          this.showDeleteConfirm.set(false);
          this.deletingTicket.set(null);
          this.loadTickets(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao remover ticket.');
          this.deleting.set(false);
        }
      });
  }

  statusLabel(status: TicketStatus): string {
    const labels: Record<TicketStatus, string> = {
      open: 'Aberto',
      in_progress: 'Em andamento',
      closed: 'Fechado'
    };
    return labels[status];
  }

  priorityLabel(priority: TicketPriority): string {
    const labels: Record<TicketPriority, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return labels[priority];
  }

  get pages(): number[] {
    const totalPages = this.meta()?.totalPages ?? 0;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
