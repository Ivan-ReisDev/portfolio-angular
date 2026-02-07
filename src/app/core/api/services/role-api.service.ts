import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { Role, CreateRolePayload, UpdateRolePayload } from '../models/role.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/roles`;
  }

  findAll(page = 1, limit = 10): Observable<PaginatedResponse<Role>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Role>>(this.endpoint, { params });
  }

  findById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.endpoint}/${id}`);
  }

  create(payload: CreateRolePayload): Observable<Role> {
    return this.http.post<Role>(this.endpoint, payload);
  }

  update(id: string, payload: UpdateRolePayload): Observable<Role> {
    return this.http.patch<Role>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
