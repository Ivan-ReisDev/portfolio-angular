import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { SendEmailPayload, SendEmailResponse } from '../models/email.model';

@Injectable({ providedIn: 'root' })
export class EmailApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/emails`;
  }

  send(payload: SendEmailPayload): Observable<SendEmailResponse> {
    return this.http.post<SendEmailResponse>(`${this.endpoint}/send`, payload);
  }
}
