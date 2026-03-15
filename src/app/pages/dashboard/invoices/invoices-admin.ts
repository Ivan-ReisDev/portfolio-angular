import { Component, inject, signal, OnInit, DestroyRef, PLATFORM_ID, ElementRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { InvoiceApiService } from '../../../core/api/services/invoice-api.service';
import { UserApiService } from '../../../core/api/services/user-api.service';
import { AuthService } from '../../../core/api/services/auth.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { Modal } from '../../../core/components/dashboard/modal/modal';
import { ConfirmDialog } from '../../../core/components/dashboard/confirm-dialog/confirm-dialog';
import { Invoice, InvoiceStatus } from '../../../core/api/models/invoice.model';
import { User } from '../../../core/api/models/user.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

@Component({
  selector: 'app-invoices-admin',
  imports: [DatePipe, ReactiveFormsModule, Modal, ConfirmDialog],
  templateUrl: './invoices-admin.html',
  styleUrl: './invoices-admin.scss'
})
export class InvoicesAdmin implements OnInit {
  private readonly invoiceApi = inject(InvoiceApiService);
  private readonly userApi = inject(UserApiService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly notaFiscalInput = viewChild<ElementRef<HTMLInputElement>>('notaFiscalInput');
  readonly comprovanteInput = viewChild<ElementRef<HTMLInputElement>>('comprovanteInput');

  readonly loading = signal(true);
  readonly invoices = signal<Invoice[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly currentPage = signal(1);

  readonly users = signal<User[]>([]);

  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly editingInvoice = signal<Invoice | null>(null);
  readonly submitting = signal(false);

  readonly showDetailModal = signal(false);
  readonly selectedInvoice = signal<Invoice | null>(null);

  readonly showDeleteConfirm = signal(false);
  readonly deletingInvoice = signal<Invoice | null>(null);
  readonly deleting = signal(false);

  readonly uploadingNotaFiscal = signal(false);
  readonly uploadingComprovante = signal(false);
  private uploadTargetId = '';

  readonly canCreate = this.authService.hasPermission('invoices', 'create');
  readonly canUpdate = this.authService.hasPermission('invoices', 'update');
  readonly canDelete = this.authService.hasPermission('invoices', 'delete');

  readonly createForm = this.fb.nonNullable.group({
    description: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    dueDate: ['', [Validators.required]],
    userId: ['', [Validators.required]]
  });

  readonly editForm = this.fb.nonNullable.group({
    description: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    dueDate: ['', [Validators.required]],
    userId: ['', [Validators.required]],
    paidAt: ['']
  });

  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  ngOnInit(): void {
    this.loadInvoices();
    this.loadUsers();
  }

  loadInvoices(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.invoiceApi
      .findAll(page, 10, 'dueDate', 'DESC')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.invoices.set(response.data);
          this.meta.set(response.meta);
          this.loading.set(false);
        },
        error: () => {
          this.toast.error('Erro ao carregar faturas.');
          this.loading.set(false);
        }
      });
  }

  loadUsers(): void {
    this.userApi
      .findAll(1, 100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.users.set(response.data),
        error: () => this.toast.error('Erro ao carregar usuários.')
      });
  }

  openCreateModal(): void {
    this.createForm.reset({ description: '', amount: 0, dueDate: '', userId: '' });
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.createForm.reset();
  }

  submitCreateForm(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const values = this.createForm.getRawValue();

    this.invoiceApi
      .create({
        description: values.description,
        amount: values.amount,
        dueDate: values.dueDate,
        userId: values.userId
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Fatura criada com sucesso.');
          this.submitting.set(false);
          this.closeCreateModal();
          this.loadInvoices(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao criar fatura.');
          this.submitting.set(false);
        }
      });
  }

  viewInvoice(invoice: Invoice): void {
    this.selectedInvoice.set(invoice);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedInvoice.set(null);
  }

  openEditModal(invoice: Invoice): void {
    this.editingInvoice.set(invoice);

    this.editForm.patchValue({
      description: invoice.description,
      amount: parseFloat(String(invoice.amount)),
      dueDate: invoice.dueDate.substring(0, 10),
      userId: invoice.userId,
      paidAt: invoice.paidAt ? invoice.paidAt.substring(0, 16) : ''
    });

    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingInvoice.set(null);
    this.editForm.reset();
  }

  submitEditForm(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const invoice = this.editingInvoice();
    if (!invoice) return;

    this.submitting.set(true);
    const values = this.editForm.getRawValue();

    this.invoiceApi
      .update(invoice.id, {
        description: values.description,
        amount: values.amount,
        dueDate: values.dueDate,
        userId: values.userId,
        paidAt: values.paidAt ? new Date(values.paidAt).toISOString() : null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Fatura atualizada com sucesso.');
          this.submitting.set(false);
          this.closeEditModal();
          this.loadInvoices(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao atualizar fatura.');
          this.submitting.set(false);
        }
      });
  }

  confirmDelete(invoice: Invoice): void {
    this.deletingInvoice.set(invoice);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingInvoice.set(null);
  }

  deleteInvoice(): void {
    const invoice = this.deletingInvoice();
    if (!invoice) return;

    this.deleting.set(true);

    this.invoiceApi
      .delete(invoice.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Fatura removida com sucesso.');
          this.deleting.set(false);
          this.showDeleteConfirm.set(false);
          this.deletingInvoice.set(null);
          this.loadInvoices(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao remover fatura.');
          this.deleting.set(false);
        }
      });
  }

  triggerNotaFiscalUpload(invoiceId: string): void {
    this.uploadTargetId = invoiceId;
    this.notaFiscalInput()?.nativeElement.click();
  }

  triggerComprovanteUpload(invoiceId: string): void {
    this.uploadTargetId = invoiceId;
    this.comprovanteInput()?.nativeElement.click();
  }

  onNotaFiscalSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.uploadTargetId) return;

    this.uploadingNotaFiscal.set(true);

    this.invoiceApi
      .uploadNotaFiscal(this.uploadTargetId, file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Nota fiscal enviada com sucesso.');
          this.uploadingNotaFiscal.set(false);
          this.loadInvoices(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao enviar nota fiscal.');
          this.uploadingNotaFiscal.set(false);
        }
      });

    input.value = '';
  }

  onComprovanteSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.uploadTargetId) return;

    this.uploadingComprovante.set(true);

    this.invoiceApi
      .uploadComprovante(this.uploadTargetId, file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Comprovante enviado com sucesso.');
          this.uploadingComprovante.set(false);
          this.loadInvoices(this.currentPage());
        },
        error: () => {
          this.toast.error('Erro ao enviar comprovante.');
          this.uploadingComprovante.set(false);
        }
      });

    input.value = '';
  }

  openNotaFiscal(invoiceId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.invoiceApi
      .getNotaFiscalUrl(invoiceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => window.open(response.url, '_blank'),
        error: () => this.toast.error('Erro ao obter URL da nota fiscal.')
      });
  }

  openComprovante(invoiceId: string, fileId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.invoiceApi
      .getComprovanteUrl(invoiceId, fileId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => window.open(response.url, '_blank'),
        error: () => this.toast.error('Erro ao obter URL do comprovante.')
      });
  }

  deleteComprovante(invoiceId: string, fileId: string): void {
    this.invoiceApi
      .deleteComprovante(invoiceId, fileId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Comprovante removido com sucesso.');
          this.loadInvoices(this.currentPage());
        },
        error: () => this.toast.error('Erro ao remover comprovante.')
      });
  }

  resolveStatus(invoice: Invoice): InvoiceStatus {
    if (invoice.status) return invoice.status;
    if (invoice.paidAt) return 'paid';
    return new Date(invoice.dueDate) < new Date() ? 'overdue' : 'pending';
  }

  statusLabel(status: InvoiceStatus): string {
    const labels: Record<InvoiceStatus, string> = {
      pending: 'Pendente',
      overdue: 'Vencida',
      paid: 'Paga'
    };
    return labels[status];
  }

  formatAmount(amount: number | string): string {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(value)) return 'R$ 0,00';
    return this.currencyFormatter.format(value);
  }

  get pages(): number[] {
    const totalPages = this.meta()?.totalPages ?? 0;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
