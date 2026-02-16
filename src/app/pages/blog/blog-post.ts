import { Component, inject, input, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { BlogService } from '../../core/services/blog.service';
import { SEOService } from '../../core/services/seo.service';

const CATEGORY_LABELS: Record<string, string> = {
  blog: 'Blog',
  cheatsheet: 'Cheatsheet',
  cookbook: 'Cookbook',
};

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, MarkdownComponent],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
})
export class BlogPost {
  private readonly blogService = inject(BlogService);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SEOService);

  slug = input<string>('');

  readonly effectiveSlug = computed(() =>
    this.slug() || this.route.snapshot.paramMap.get('slug') || ''
  );

  readonly post = computed(() => {
    const s = this.effectiveSlug();
    const found = this.blogService.getPostBySlug(s);
    if (found) this.setSEO(found);
    return found;
  });

  readonly relatedPosts = computed(() => {
    const s = this.effectiveSlug();
    return this.blogService.getRelatedPosts(s, 3);
  });

  categoryLabel(category: string): string {
    return CATEGORY_LABELS[category] ?? category;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  private setSEO(post: { title: string; excerpt: string; coverImage: string; tags: string[]; slug: string }): void {
    this.seoService.setBasicSEO({
      title: `${post.title} - Ivan Reis`,
      description: post.excerpt,
      keywords: post.tags,
      type: 'article',
      image: post.coverImage,
      url: `https://ivanreis.com.br/blog/${post.slug}`,
      locale: 'pt_BR',
    });
  }
}
