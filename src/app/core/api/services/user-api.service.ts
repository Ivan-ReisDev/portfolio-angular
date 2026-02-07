import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { User, CreateUserPayload, UpdateUserPayload } from '../models/user.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/users`;
  }

  findAll(page = 1, limit = 10): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<User>>(this.endpoint, { params });
  }

  findById(id: string): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }

  create(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(this.endpoint, payload);
  }

  update(id: string, payload: UpdateUserPayload): Observable<User> {
    return this.http.patch<User>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
