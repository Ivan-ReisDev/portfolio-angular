import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { Invoice, CreateInvoicePayload, UpdateInvoicePayload, SignedUrlResponse } from '../models/invoice.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/invoices`;
  }

  findAll(page = 1, limit = 10, sort = 'createdAt', order = 'DESC'): Observable<PaginatedResponse<Invoice>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    return this.http.get<PaginatedResponse<Invoice>>(this.endpoint, { params });
  }

  findById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.endpoint}/${id}`);
  }

  create(payload: CreateInvoicePayload): Observable<Invoice> {
    return this.http.post<Invoice>(this.endpoint, payload);
  }

  update(id: string, payload: UpdateInvoicePayload): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  uploadNotaFiscal(id: string, file: File): Observable<Invoice> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Invoice>(`${this.endpoint}/${id}/nota-fiscal`, formData);
  }

  uploadComprovante(id: string, file: File): Observable<Invoice> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Invoice>(`${this.endpoint}/${id}/comprovante`, formData);
  }

  getNotaFiscalUrl(id: string): Observable<SignedUrlResponse> {
    return this.http.get<SignedUrlResponse>(`${this.endpoint}/${id}/nota-fiscal/url`);
  }

  getComprovanteUrl(invoiceId: string, fileId: string): Observable<SignedUrlResponse> {
    return this.http.get<SignedUrlResponse>(`${this.endpoint}/${invoiceId}/comprovantes/${fileId}/url`);
  }

  deleteComprovante(invoiceId: string, fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${invoiceId}/comprovantes/${fileId}`);
  }
}
