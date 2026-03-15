export type InvoiceStatus = 'pending' | 'overdue' | 'paid';

export interface Invoice {
  id: string;
  description: string;
  amount: number | string;
  dueDate: string;
  paidAt: string | null;
  notaFiscalId: string | null;
  comprovantes?: string[];
  userId: string;
  status: InvoiceStatus;
  user: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoicePayload {
  description: string;
  amount: number;
  dueDate: string;
  userId: string;
}

export interface UpdateInvoicePayload {
  description?: string;
  amount?: number;
  dueDate?: string;
  userId?: string;
  paidAt?: string | null;
}

export interface SignedUrlResponse {
  url: string;
  expiresIn: number;
}
