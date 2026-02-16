import { Injectable, inject, signal, PLATFORM_ID, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { catchError, tap, of } from 'rxjs';
import { BlogPost, BlogCategory } from '../models/blog-post.model';

const BLOG_POSTS_KEY = makeStateKey<BlogPost[]>('blogPosts');

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _posts = signal<BlogPost[]>([]);
  private readonly _loading = signal<boolean>(true);
  private readonly _error = signal<string | null>(null);

  readonly posts = this._posts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly sortedPosts = computed(() =>
    [...this._posts()].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  );

  readonly latestPosts = computed(() => this.sortedPosts().slice(0, 4));

  constructor() {
    this.loadPosts();
  }

  getPostsByCategory(category: BlogCategory): BlogPost[] {
    return this.sortedPosts().filter(post => post.category === category);
  }

  getPostBySlug(slug: string): BlogPost | undefined {
    return this._posts().find(post => post.slug === slug);
  }

  getRelatedPosts(slug: string, limit = 3): BlogPost[] {
    const current = this.getPostBySlug(slug);
    if (!current) return [];
    return this.sortedPosts()
      .filter(post => post.slug !== slug && post.category === current.category)
      .slice(0, limit);
  }

  private loadPosts(): void {
    if (this.transferState.hasKey(BLOG_POSTS_KEY)) {
      const cached = this.transferState.get(BLOG_POSTS_KEY, []);
      this._posts.set(cached);
      this._loading.set(false);
      this.transferState.remove(BLOG_POSTS_KEY);
      return;
    }

    this.http.get<{ posts: BlogPost[] }>('/data/blog-posts.json')
      .pipe(
        tap(response => {
          this._posts.set(response.posts);
          this._loading.set(false);

          if (isPlatformServer(this.platformId)) {
            this.transferState.set(BLOG_POSTS_KEY, response.posts);
          }
        }),
        catchError(err => {
          this._error.set('Falha ao carregar posts');
          this._loading.set(false);
          console.error('BlogService error:', err);
          return of({ posts: [] });
        })
      )
      .subscribe();
  }
}
