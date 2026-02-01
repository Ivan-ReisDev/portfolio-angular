import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { Contact, CreateContactPayload } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/contacts`;
  }

  create(payload: CreateContactPayload): Observable<Contact> {
    return this.http.post<Contact>(this.endpoint, payload);
  }
}
