import { Component, inject, signal, OnInit, DestroyRef, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser, DatePipe } from '@angular/common';

import { InvoiceApiService } from '../../../core/api/services/invoice-api.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { Modal } from '../../../core/components/dashboard/modal/modal';
import { Invoice, InvoiceStatus } from '../../../core/api/models/invoice.model';
import { PaginationMeta } from '../../../core/api/models/api-response.model';

@Component({
  selector: 'app-invoices-user',
  imports: [DatePipe, Modal],
  templateUrl: './invoices-user.html',
  styleUrl: './invoices-user.scss'
})
export class InvoicesUser implements OnInit {
  private readonly invoiceApi = inject(InvoiceApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loading = signal(true);
  readonly invoices = signal<Invoice[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly currentPage = signal(1);

  readonly showDetailModal = signal(false);
  readonly selectedInvoice = signal<Invoice | null>(null);

  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  ngOnInit(): void {
    this.loadInvoices();
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

  viewInvoice(invoice: Invoice): void {
    this.selectedInvoice.set(invoice);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedInvoice.set(null);
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
