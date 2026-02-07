import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';
import { PermissionEntity } from '../models/permission.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class PermissionApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private get endpoint(): string {
    return `${this.apiConfig.baseUrl}/permissions`;
  }

  findAll(page = 1, limit = 20): Observable<PaginatedResponse<PermissionEntity>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<PermissionEntity>>(this.endpoint, { params });
  }

  findById(id: string): Observable<PermissionEntity> {
    return this.http.get<PermissionEntity>(`${this.endpoint}/${id}`);
  }
}
