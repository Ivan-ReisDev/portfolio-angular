import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from '../api.config';
import {
  LoginPayload,
  AuthResponse,
  AuthenticatedUser,
  Resource,
  Action,
  Permission
} from '../models/auth.model';

const AUTH_STORAGE_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _token = signal<string | null>(this.readTokenFromStorage());
  // JWTs are opaque on the client. Claims are only accepted from the API's
  // server-validated login response and are never decoded or used to grant access.
  private readonly _identity = signal<AuthenticatedUser | null>(null);

  readonly isLoggedIn = computed(() => this._token() !== null);

  readonly currentUser = computed(() => this._identity());

  readonly userPermissions = computed<Permission[]>(() => this._identity()?.permissions ?? []);

  readonly userRole = computed(() => this._identity()?.role ?? null);

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiConfig.baseUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.setToken(response.accessToken);
          this._identity.set(response.user ?? null);
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
      localStorage.setItem(AUTH_STORAGE_KEY, token);
    }
  }

  clearToken(): void {
    this._token.set(null);
    this._identity.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  private readTokenFromStorage(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(AUTH_STORAGE_KEY);
  }
}
