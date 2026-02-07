import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from '../api.config';
import {
  LoginPayload,
  AuthResponse,
  JwtPayload,
  Resource,
  Action,
  Permission
} from '../models/auth.model';

const TOKEN_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _token = signal<string | null>(this.readTokenFromStorage());
  private readonly _payload = computed<JwtPayload | null>(() => {
    const token = this._token();
    if (!token) return null;
    return this.decodePayload(token);
  });

  readonly isLoggedIn = computed(() => {
    const payload = this._payload();
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  });

  readonly currentUser = computed(() => {
    const payload = this._payload();
    if (!payload) return null;
    return { sub: payload.sub, email: payload.email, role: payload.role };
  });

  readonly userPermissions = computed<Permission[]>(() => {
    const payload = this._payload();
    return payload?.permissions ?? [];
  });

  readonly userRole = computed(() => this._payload()?.role ?? null);

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiConfig.baseUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.setToken(response.accessToken);
        })
      );
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  hasPermission(resource: Resource, action: Action): boolean {
    return this.userPermissions().includes(`${resource}:${action}` as Permission);
  }

  isAdmin(): boolean {
    return this.userRole() === 'ADMIN';
  }

  private setToken(token: string): void {
    this._token.set(token);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearToken(): void {
    this._token.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private readTokenFromStorage(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private decodePayload(token: string): JwtPayload | null {
    try {
      const base64Payload = token.split('.')[1];
      const jsonPayload = atob(base64Payload);
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
