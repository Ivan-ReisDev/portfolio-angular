import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { TicketApiService } from '../../../core/api/services/ticket-api.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { Modal } from '../../../core/components/dashboard/modal/modal';
import { Ticket, TicketPriority, TicketStatus } from '../../../core/api/models/ticket.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

@Component({
  selector: 'app-tickets-user',
  imports: [DatePipe, ReactiveFormsModule, Modal],
  templateUrl: './tickets-user.html',
  styleUrl: './tickets-user.scss'
})
export class TicketsUser implements OnInit {
  private readonly ticketApi = inject(TicketApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly tickets = signal<Ticket[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly currentPage = signal(1);

  readonly showCreateModal = signal(false);
  readonly submitting = signal(false);

  readonly showDetailModal = signal(false);
  readonly selectedTicket = signal<Ticket | null>(null);

  readonly ticketForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    priority: ['medium' as TicketPriority],
    links: this.fb.array<string>([])
  });

  get linksArray(): FormArray {
    return this.ticketForm.controls.links;
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

  openCreateModal(): void {
    this.ticketForm.reset({ title: '', description: '', priority: 'medium' });
    this.linksArray.clear();
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.ticketForm.reset();
    this.linksArray.clear();
  }

  addLink(): void {
    this.linksArray.push(this.fb.nonNullable.control('', Validators.required));
  }

  removeLink(index: number): void {
    this.linksArray.removeAt(index);
  }

  submitForm(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const values = this.ticketForm.getRawValue();
    const links = values.links
      .filter((l): l is string => typeof l === 'string' && l.trim().length > 0);

    this.ticketApi
      .create({
        title: values.title,
        description: values.description,
        priority: values.priority as TicketPriority,
        ...(links.length > 0 ? { links } : {})
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Ticket criado com sucesso.');
          this.submitting.set(false);
          this.closeCreateModal();
          this.loadTickets(1);
        },
        error: () => {
          this.toast.error('Erro ao criar ticket.');
          this.submitting.set(false);
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
