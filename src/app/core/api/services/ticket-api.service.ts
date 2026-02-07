import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { Ticket, CreateTicketPayload, UpdateTicketPayload } from '../models/ticket.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TicketApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/tickets`;
  }

  findAll(page = 1, limit = 10): Observable<PaginatedResponse<Ticket>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Ticket>>(this.endpoint, { params });
  }

  findById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.endpoint}/${id}`);
  }

  create(payload: CreateTicketPayload): Observable<Ticket> {
    return this.http.post<Ticket>(this.endpoint, payload);
  }

  update(id: string, payload: UpdateTicketPayload): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
