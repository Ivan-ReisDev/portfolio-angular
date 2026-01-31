import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Project } from '../models/project.model';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
  siteName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private readonly defaultData = {
    author: 'Ivan Reis',
    siteName: 'Ivan Reis - Portfolio',
    locale: 'pt_BR',
    type: 'website',
    url: 'https://ivanreis.com.br'
  };

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {}

  updateSEO(data: SEOData): void {
    const fullData = { ...this.defaultData, ...data };
    const fullUrl = data.url ? `${this.defaultData.url}${data.url}` : this.defaultData.url;

    this.title.setTitle(fullData.title);

    this.meta.updateTag({ name: 'description', content: fullData.description });
    this.meta.updateTag({ name: 'author', content: fullData.author });
    this.meta.updateTag({ name: 'keywords', content: fullData.keywords || '' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'googlebot', content: 'index, follow' });
    this.meta.updateTag({ name: 'language', content: 'pt-BR' });
    this.meta.updateTag({ name: 'geo.region', content: 'BR' });
    this.meta.updateTag({ name: 'geo.placename', content: 'Brazil' });
    this.meta.updateTag({ name: 'ICBM', content: '-14.2350,-51.9253' });

    this.meta.updateTag({ property: 'og:title', content: fullData.title });
    this.meta.updateTag({ property: 'og:description', content: fullData.description });
    this.meta.updateTag({ property: 'og:image', content: fullData.image || `${this.defaultData.url}/images/og-default.jpg` });
    this.meta.updateTag({ property: 'og:url', content: fullUrl });
    this.meta.updateTag({ property: 'og:type', content: fullData.type });
    this.meta.updateTag({ property: 'og:locale', content: 'pt_BR' });
    this.meta.updateTag({ property: 'og:site_name', content: fullData.siteName });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullData.title });
    this.meta.updateTag({ name: 'twitter:description', content: fullData.description });
    this.meta.updateTag({ name: 'twitter:image', content: fullData.image || `${this.defaultData.url}/images/og-default.jpg` });
    this.meta.updateTag({ name: 'twitter:creator', content: '@ivanreis' });
    this.meta.updateTag({ name: 'twitter:site', content: '@ivanreis' });

    this.meta.updateTag({ itemprop: 'name', content: fullData.title });
    this.meta.updateTag({ itemprop: 'description', content: fullData.description });
    this.meta.updateTag({ itemprop: 'image', content: fullData.image || `${this.defaultData.url}/images/og-default.jpg` });

    const canonicalUrl = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      canonicalUrl.setAttribute('href', fullUrl);
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', fullUrl);
      document.head.appendChild(link);
    }
  }

  setHomeSEO(): void {
    this.updateSEO({
      title: 'Ivan Reis - Desenvolvedor Full-Stack | Portfolio',
      description: 'Desenvolvedor Full-Stack especializado em Angular, Node.js, TypeScript. Criação de aplicações web modernas, APIs RESTful e plataformas escaláveis. Conheça meus projetos!',
      keywords: 'desenvolvedor full-stack, angular, nodejs, typescript, portfolio, ivan reis, programador, desenvolvedor web, brasil',
      image: '/images/og-home.jpg',
      type: 'website'
    });
  }

  setProjectSEO(project: Project): void {
    const title = `${project.title} - Ivan Reis | Portfolio`;
    const description = project.description.length > 160 
      ? project.description.substring(0, 157) + '...' 
      : project.description;
    
    this.updateSEO({
      title,
      description,
      keywords: `${project.technologies.join(', ')}, ${project.title}, ivan reis, portfolio, projeto, desenvolvimento web`,
      image: project.images[0] || '/images/og-default.jpg',
      url: `/projeto/${project.id}`,
      type: 'article'
    });
  }

  setAboutSEO(): void {
    this.updateSEO({
      title: 'Sobre Ivan Reis - Desenvolvedor Full-Stack | Curriculo',
      description: 'Conheça mais sobre Ivan Reis, desenvolvedor Full-Stack com experiência em Angular, Node.js, TypeScript e tecnologias modernas. Formação, habilidades e trajetória profissional.',
      keywords: 'sobre ivan reis, curriculo, desenvolvedor full-stack, habilidades, experiencia profissional, angular, nodejs',
      image: '/images/og-about.jpg',
      url: '/sobre',
      type: 'profile'
    });
  }

  setContactSEO(): void {
    this.updateSEO({
      title: 'Contato - Ivan Reis | Desenvolvedor Full-Stack',
      description: 'Entre em contato com Ivan Reis, desenvolvedor Full-Stack. Disponível para projetos freelancers, consultoria e oportunidades profissionais.',
      keywords: 'contato ivan reis, freelancer, desenvolvedor, oportunidades, projeto, consultoria',
      image: '/images/og-contact.jpg',
      url: '/contato',
      type: 'website'
    });
  }

  addStructuredData(jsonLd: object): void {
    const script = document.createElement('script') as HTMLScriptElement;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd, null, 2);
    document.head.appendChild(script);
  }

  removeStructuredData(): void {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
  }
}