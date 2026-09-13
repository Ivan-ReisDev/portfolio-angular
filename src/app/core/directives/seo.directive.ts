import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Directive({
  selector: '[appSEO]',
  standalone: true
})
export class SEODirective implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() keywords: string = '';
  @Input() image: string = '';
  @Input() type: string = 'website';
  @Input() author: string = 'Ivan Reis';
  @Input() twitterCard: string = 'summary_large_image';
  @Input() twitterCreator: string = '@ivanreis';

  private originalTitle = '';

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.originalTitle = this.titleService.getTitle();
    this.updateMetaTags();
  }

  ngOnDestroy(): void {
    this.titleService.setTitle(this.originalTitle);
    this.removeMetaTags();
  }

  private updateMetaTags(): void {
    this.updateBasicMetaTags();
    const url = `https://ivanreis.com.br${this.router.url}`;
    this.updateSocialMetaTags(url);
    this.updateCanonical(url);
  }

  private updateBasicMetaTags(): void {
    this.titleService.setTitle(this.title || this.titleService.getTitle());
    this.meta.updateTag({ name: 'description', content: this.description });
    this.meta.updateTag({ name: 'keywords', content: this.keywords });
    this.meta.updateTag({ name: 'author', content: this.author });
  }

  private updateSocialMetaTags(url: string): void {
    const openGraph = { title: this.title, description: this.description, image: this.image, url, type: this.type, locale: 'pt_BR', site_name: 'Ivan Reis - Portfólio' };
    const twitter = { card: this.twitterCard, title: this.title, description: this.description, image: this.image, creator: this.twitterCreator, site: this.twitterCreator };
    const tags = [
      ...Object.entries(openGraph).map(([property, content]) => ({ property: `og:${property}`, content })),
      ...Object.entries(twitter).map(([name, content]) => ({ name: `twitter:${name}`, content }))
    ];
    for (const tag of tags) this.meta.updateTag(tag);
    this.meta.updateTag({ itemprop: 'name', content: this.title });
    this.meta.updateTag({ itemprop: 'description', content: this.description });
    this.meta.updateTag({ itemprop: 'image', content: this.image });
  }

  private updateCanonical(url: string): void {
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    canonicalLink?.setAttribute('href', url);
    if (canonicalLink) return;
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  private removeMetaTags(): void {
    const metaTags = [
      'description',
      'keywords',
      'og:title',
      'og:description',
      'og:image',
      'og:url',
      'og:type',
      'og:locale',
      'og:site_name',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:creator',
      'twitter:site',
      'name',
      'description',
      'image'
    ];

    for (const tag of metaTags) {
      this.meta.removeTag(`name='${tag}'`);
      this.meta.removeTag(`property='${tag}'`);
      this.meta.removeTag(`itemprop='${tag}'`);
    }
  }
}
