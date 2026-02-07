import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { Contact, CreateContactPayload } from '../models/contact.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/contacts`;
  }

  findAll(page = 1, limit = 10): Observable<PaginatedResponse<Contact>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Contact>>(this.endpoint, { params });
  }

  findById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.endpoint}/${id}`);
  }

  create(payload: CreateContactPayload): Observable<Contact> {
    return this.http.post<Contact>(this.endpoint, payload);
  }

  update(id: string, payload: Partial<CreateContactPayload>): Observable<Contact> {
    return this.http.patch<Contact>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
