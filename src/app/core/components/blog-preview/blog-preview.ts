import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog-post.model';
import { Title } from '../typography/title/title';

const CATEGORY_LABELS: Record<string, string> = {
  blog: 'Blog',
  cheatsheet: 'Cheatsheet',
  cookbook: 'Cookbook',
};

@Component({
  selector: 'app-blog-preview',
  imports: [RouterLink, Title],
  templateUrl: './blog-preview.html',
  styleUrl: './blog-preview.scss',
})
export class BlogPreview implements OnInit, OnDestroy {
  private readonly blogService = inject(BlogService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly posts = this.blogService.latestPosts;
  readonly loading = this.blogService.loading;
  readonly isVisible = signal(false);

  @ViewChild('blogSection', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  private observer: IntersectionObserver | null = null;

  get featuredPost(): BlogPost | undefined {
    return this.posts()[0];
  }

  get sidePosts(): BlogPost[] {
    return this.posts().slice(1, 4);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupObserver();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  categoryLabel(category: string): string {
    return CATEGORY_LABELS[category] ?? category;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible.set(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (this.sectionRef?.nativeElement) {
      this.observer.observe(this.sectionRef.nativeElement);
    }
  }
}
