import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Project } from '../models/project.model';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  url?: string;
  siteName?: string;
  locale?: string;
}

export interface PersonSchema {
  '@context': string;
  '@type': string;
  name: string;
  alternateName?: string;
  jobTitle: string;
  url: string;
  image?: string;
  description: string;
  sameAs?: string[];
  knowsAbout?: string[];
  nationality?: string;
  knowsLanguage?: string;
  alumniOf?: {
    '@type': string;
    name: string;
  };
  address?: {
    '@type': string;
    addressCountry: string;
    addressRegion: string;
    addressLocality: string;
  };
}

export interface ProjectSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  creator: {
    '@type': string;
    name: string;
  };
  programmingLanguage?: string[];
  applicationCategory?: string;
  dateCreated?: string;
  url?: string;
  image?: string | string[];
  offers?: {
    '@type': string;
    url?: string;
    availability?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private readonly baseUrl = 'https://ivanreis.com.br';
  private readonly isBrowser: boolean;
  private readonly siteName = 'Ivan Reis - Portfólio';

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setBasicSEO(seoData: SEOData): void {
    if (!this.isBrowser) return;

    const fullTitle = `${seoData.title} | ${this.siteName}`;
    
    this.title.setTitle(fullTitle);
    
    this.meta.updateTag({ name: 'description', content: seoData.description });
    
    if (seoData.keywords && seoData.keywords.length > 0) {
      this.meta.updateTag({ name: 'keywords', content: seoData.keywords.join(', ') });
    }
    
    this.meta.updateTag({ name: 'author', content: 'Ivan Reis' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'language', content: seoData.locale || 'pt-BR' });
    
    this.updateOpenGraph(seoData);
    this.updateTwitterCards(seoData);
    this.setCanonical(seoData.url || `${this.baseUrl}${this.router.url}`);
  }

  setPersonSEO(): void {
    if (!this.isBrowser) return;

    const personSchema: PersonSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ivan Reis',
      alternateName: 'Ivan Reis Dev',
      jobTitle: 'Tech Lead & Desenvolvedor Full Stack',
      url: this.baseUrl,
      image: `${this.baseUrl}/images/ivan-reis-profile.jpg`,
      description: 'Tech Lead e Desenvolvedor Full Stack com 4+ anos de experiência em soluções escaláveis com inteligência artificial, automações e APIs robustas.',
      sameAs: [
        'https://github.com/Ivan-ReisDev',
        'https://linkedin.com/in/ivanreis',
        'https://instagram.com/ivanreis'
      ],
      knowsAbout: [
        'NestJS',
        'React',
        'Next.js',
        'Angular',
        'FastAPI',
        'TypeScript',
        'PostgreSQL',
        'Docker',
        'AWS',
        'Inteligência Artificial',
        'DevOps'
      ],
      nationality: 'Brasileiro',
      knowsLanguage: 'pt-BR',
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'UNINTER - Centro Universitário Internacional'
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressRegion: 'RJ',
        addressLocality: 'Rio de Janeiro'
      }
    };

    this.addStructuredData(personSchema);
  }

  setProjectSEO(project: Project): void {
    if (!this.isBrowser) return;

    const title = `${project.title} | Projeto Desenvolvido por Ivan Reis`;
    const description = `${project.description} Desenvolvido com ${project.technologies.slice(0, 3).join(', ')} por Ivan Reis.`;
    
    this.setBasicSEO({
      title: project.title,
      description,
      keywords: project.technologies,
      image: project.images?.[0] ? `${this.baseUrl}${project.images[0]}` : undefined,
      imageAlt: `${project.title} - Print do projeto`,
      type: 'article',
      url: `${this.baseUrl}/projetos/${project.id}`,
      locale: 'pt_BR'
    });

    const projectSchema: ProjectSchema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      creator: {
        '@type': 'Person',
        name: 'Ivan Reis'
      },
      programmingLanguage: project.technologies,
      applicationCategory: 'Web Application',
      dateCreated: new Date().toISOString(),
      url: `${this.baseUrl}/projetos/${project.id}`,
      image: project.images?.[0] ? `${this.baseUrl}${project.images[0]}` : undefined,
      offers: project.demoUrl ? {
        '@type': 'Offer',
        url: project.demoUrl,
        availability: 'https://schema.org/InStock'
      } : undefined
    };

    this.addStructuredData(projectSchema);
  }

  setAboutSEO(): void {
    if (!this.isBrowser) return;

    const seoData: SEOData = {
      title: 'Sobre Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
      description: 'Tech Lead com 4+ anos de experiência em NestJS, React, Next.js, Angular, FastAPI, AWS e IA. Graduado em ADS, com pós-graduações em Ciências de Dados e IA e em Segurança Cibernética pela UNINTER.',
      keywords: ['sobre ivan reis', 'tech lead', 'desenvolvedor full stack', 'currículo', 'nestjs', 'react', 'angular', 'inteligência artificial'],
      type: 'website',
      url: `${this.baseUrl}/sobre`,
      locale: 'pt_BR'
    };

    this.setBasicSEO(seoData);
    this.setPersonSEO();
  }

  setContactSEO(): void {
    if (!this.isBrowser) return;

    const seoData: SEOData = {
      title: 'Contato - Ivan Reis | Tech Lead & Desenvolvedor Full Stack',
      description: 'Entre em contato com Ivan Reis. Disponível para projetos de desenvolvimento, automações com IA, consultoria técnica e liderança de equipes.',
      keywords: ['contato ivan reis', 'contratar tech lead', 'desenvolvedor full stack', 'consultoria técnica', 'automação com ia'],
      type: 'website',
      url: `${this.baseUrl}/contato`,
      locale: 'pt_BR'
    };

    this.setBasicSEO(seoData);
  }

  private updateOpenGraph(seoData: SEOData): void {
    const ogData = {
      'og:title': seoData.title,
      'og:description': seoData.description,
      'og:type': seoData.type || 'website',
      'og:locale': seoData.locale || 'pt_BR',
      'og:site_name': this.siteName,
      'og:url': seoData.url || `${this.baseUrl}${this.router.url}`,
      'og:image': seoData.image,
      'og:image:alt': seoData.imageAlt,
      'og:image:width': '1200',
      'og:image:height': '630'
    };

    Object.entries(ogData).forEach(([property, content]) => {
      if (content) {
        this.meta.updateTag({ property, content: String(content) });
      }
    });
  }

  private updateTwitterCards(seoData: SEOData): void {
    const twitterData = {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@ivanreis',
      'twitter:creator': '@ivanreis',
      'twitter:title': seoData.title,
      'twitter:description': seoData.description,
      'twitter:image': seoData.image
    };

    Object.entries(twitterData).forEach(([name, content]) => {
      if (content) {
        this.meta.updateTag({ name, content: String(content) });
      }
    });
  }

  private setCanonical(url: string): void {
    this.meta.updateTag({ rel: 'canonical', href: url });
  }

  private addStructuredData(schema: PersonSchema | ProjectSchema): void {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  generateProjectShareUrl(projectId: string): string {
    return `https://ivanreis.com.br/projetos/${projectId}`;
  }

  generateWhatsAppShareText(project: Project): string {
    return `🚀 ${project.title} - Confira este projeto desenvolvido por Ivan Reis: ${this.generateProjectShareUrl(project.id)}`;
  }
}
