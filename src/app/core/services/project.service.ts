import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { catchError, tap, of } from 'rxjs';
import { Project } from '../models/project.model';

const PROJECTS_KEY = makeStateKey<Project[]>('projects');

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _projects = signal<Project[]>([]);
  private readonly _loading = signal<boolean>(true);
  private readonly _error = signal<string | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    this.loadProjects();
  }

  private loadProjects(): void {
    // Check TransferState first (client rehydration)
    if (this.transferState.hasKey(PROJECTS_KEY)) {
      const cached = this.transferState.get(PROJECTS_KEY, []);
      this._projects.set(cached);
      this._loading.set(false);
      this.transferState.remove(PROJECTS_KEY);
      return;
    }

    // Fetch from JSON
    this.http.get<{ projects: Project[] }>('/data/projects.json')
      .pipe(
        tap(response => {
          this._projects.set(response.projects);
          this._loading.set(false);

          // Store in TransferState for client hydration (only on server)
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(PROJECTS_KEY, response.projects);
          }
        }),
        catchError(err => {
          this._error.set('Failed to load projects');
          this._loading.set(false);
          console.error('ProjectService error:', err);
          return of({ projects: [] });
        })
      )
      .subscribe();
  }

  getProjectById(id: string): Project | undefined {
    return this._projects().find(p => p.id === id);
  }

  projectById = (id: string) => computed(() =>
    this._projects().find(p => p.id === id)
  );
}
