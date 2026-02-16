import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { BlogCategory } from '../../core/models/blog-post.model';
import { SEOService } from '../../core/services/seo.service';

type FilterOption = 'all' | BlogCategory;

const CATEGORY_LABELS: Record<FilterOption, string> = {
  all: 'Todos',
  blog: 'Blog',
  cheatsheet: 'Cheatsheets',
  cookbook: 'Cookbooks',
};

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  private readonly blogService = inject(BlogService);
  private readonly seoService = inject(SEOService);

  readonly activeFilter = signal<FilterOption>('all');
  readonly loading = this.blogService.loading;
  readonly filters: FilterOption[] = ['all', 'blog', 'cheatsheet', 'cookbook'];

  readonly filteredPosts = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.blogService.sortedPosts();
    return this.blogService.getPostsByCategory(filter);
  });

  constructor() {
    this.seoService.setBasicSEO({
      title: 'Blog - Ivan Reis',
      description: 'Artigos, cheatsheets e receitas de código sobre desenvolvimento web, TypeScript, Angular, Node.js e mais.',
      keywords: ['blog dev', 'cheatsheet', 'cookbook', 'typescript', 'angular', 'programação'],
      type: 'website',
      url: 'https://ivanreis.com.br/blog',
      locale: 'pt_BR',
    });
  }

  filterLabel(filter: FilterOption): string {
    return CATEGORY_LABELS[filter];
  }

  categoryLabel(category: string): string {
    return CATEGORY_LABELS[category as FilterOption] ?? category;
  }

  setFilter(filter: FilterOption): void {
    this.activeFilter.set(filter);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
