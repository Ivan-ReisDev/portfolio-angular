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
    if (this.title) {
      this.titleService.setTitle(this.title);
    }

    if (this.description) {
      this.meta.updateTag({ name: 'description', content: this.description });
    }

    if (this.keywords) {
      this.meta.updateTag({ name: 'keywords', content: this.keywords });
    }

    this.meta.updateTag({ name: 'author', content: this.author });

    const url = `https://ivanreis.com.br${this.router.url}`;
    
    this.meta.updateTag({ property: 'og:title', content: this.title });
    this.meta.updateTag({ property: 'og:description', content: this.description });
    this.meta.updateTag({ property: 'og:image', content: this.image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: this.type });
    this.meta.updateTag({ property: 'og:locale', content: 'pt_BR' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Ivan Reis - Portfólio' });

    this.meta.updateTag({ name: 'twitter:card', content: this.twitterCard });
    this.meta.updateTag({ name: 'twitter:title', content: this.title });
    this.meta.updateTag({ name: 'twitter:description', content: this.description });
    this.meta.updateTag({ name: 'twitter:image', content: this.image });
    this.meta.updateTag({ name: 'twitter:creator', content: this.twitterCreator });
    this.meta.updateTag({ name: 'twitter:site', content: this.twitterCreator });

    this.meta.updateTag({ itemprop: 'name', content: this.title });
    this.meta.updateTag({ itemprop: 'description', content: this.description });
    this.meta.updateTag({ itemprop: 'image', content: this.image });

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = url;
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
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

    metaTags.forEach(tag => {
      const metaElement = this.meta.getTag(`name='${tag}'`) || this.meta.getTag(`property='${tag}'`) || this.meta.getTag(`itemprop='${tag}'`);
      if (metaElement) {
        try {
          this.meta.removeTag(`name='${tag}'`);
        } catch {}
        try {
          this.meta.removeTag(`property='${tag}'`);
        } catch {}
        try {
          this.meta.removeTag(`itemprop='${tag}'`);
        } catch {}
      }
    });
  }
}