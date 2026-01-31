import { Project } from '../models/project.model';

export interface PersonStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  email?: string;
  telephone?: string;
  address?: {
    '@type': string;
    addressCountry: string;
    addressRegion: string;
  };
  knowsAbout: string[];
  sameAs: string[];
}

export interface WebsiteStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
  };
  inLanguage: string;
  isAccessibleForFree: boolean;
}

export interface CreativeWorkStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  url: string;
  dateCreated?: string;
  dateModified?: string;
  author: {
    '@type': string;
    name: string;
    url: string;
  };
  genre: string[];
  keywords: string[];
  programmingLanguage: string[];
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
  screenshot?: string[];
  softwareVersion?: string;
}

export interface ArticleStructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string[];
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  articleSection: string;
  keywords: string[];
  inLanguage: string;
}

export class StructuredDataService {
  private readonly baseUrl = 'https://ivanreis.com.br';

  getPersonSchema(): PersonStructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ivan Reis',
      jobTitle: 'Desenvolvedor Full-Stack',
      description: 'Desenvolvedor Full-Stack especializado em Angular, Node.js, TypeScript. Criação de aplicações web modernas, APIs RESTful e plataformas escaláveis.',
      url: this.baseUrl,
      image: `${this.baseUrl}/images/profile-photo.jpg`,
      email: 'contato@ivanreis.com.br',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressRegion: 'São Paulo'
      },
      knowsAbout: [
        'Desenvolvimento Web',
        'Angular',
        'Node.js',
        'TypeScript',
        'APIs RESTful',
        'Bancos de Dados',
        'Cloud Computing',
        'DevOps',
        'React',
        'Next.js',
        'NestJS',
        'MongoDB',
        'PostgreSQL',
        'Docker'
      ],
      sameAs: [
        'https://linkedin.com/in/ivanreis',
        'https://github.com/deeivan',
        'https://twitter.com/ivanreis'
      ]
    };
  }

  getWebsiteSchema(): WebsiteStructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ivan Reis - Portfolio',
      url: this.baseUrl,
      description: 'Portfolio profissional de Ivan Reis, desenvolvedor Full-Stack. Projetos em Angular, Node.js, TypeScript e tecnologias modernas.',
      author: {
        '@type': 'Person',
        name: 'Ivan Reis'
      },
      publisher: {
        '@type': 'Person',
        name: 'Ivan Reis'
      },
      inLanguage: 'pt-BR',
      isAccessibleForFree: true
    };
  }

  getCreativeWorkSchema(project: Project): CreativeWorkStructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.title,
      description: project.description,
      image: project.images.map((img: string) => `${this.baseUrl}${img}`),
      url: project.demoUrl || `${this.baseUrl}/projeto/${project.id}`,
      author: {
        '@type': 'Person',
        name: 'Ivan Reis',
        url: this.baseUrl
      },
      genre: [
        'Desenvolvimento Web',
        'Software',
        'Aplicação',
        'Plataforma Digital'
      ],
      keywords: [...project.technologies, 'portfolio', 'ivan reis', 'desenvolvimento web'],
      programmingLanguage: project.technologies.filter((tech: string) => 
        ['JavaScript', 'TypeScript', 'Python', 'PHP', 'Java', 'C#', 'Go'].includes(tech)
      ),
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      screenshot: project.images.slice(0, 3).map((img: string) => `${this.baseUrl}${img}`)
    };
  }

  getArticleSchema(project: Project): ArticleStructuredData {
    const currentDate = new Date().toISOString();
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: project.title,
      description: project.description,
      image: project.images.map((img: string) => `${this.baseUrl}${img}`),
      author: {
        '@type': 'Person',
        name: 'Ivan Reis'
      },
      publisher: {
        '@type': 'Person',
        name: 'Ivan Reis'
      },
      datePublished: currentDate,
      dateModified: currentDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/projeto/${project.id}`
      },
      articleSection: 'Portfolio',
      keywords: [...project.technologies, project.title.toLowerCase(), 'desenvolvimento web', 'ivan reis'],
      inLanguage: 'pt-BR'
    };
  }

  getBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${this.baseUrl}${crumb.url}`
      }))
    };
  }

  getOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Ivan Reis - Desenvolvedor Full-Stack',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/logo.jpg`,
      description: 'Desenvolvimento de aplicações web modernas e plataformas escaláveis',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Desenvolvimento Web',
        email: 'contato@ivanreis.com.br',
        availableLanguage: ['Portuguese', 'English']
      },
      sameAs: [
        'https://linkedin.com/in/ivanreis',
        'https://github.com/deeivan',
        'https://twitter.com/ivanreis'
      ]
    };
  }

  getLocalBusinessSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Ivan Reis - Desenvolvedor Full-Stack',
      url: this.baseUrl,
      telephone: '+55-11-99999-9999',
      email: 'contato@ivanreis.com.br',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressRegion: 'SP'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '-23.5505',
        longitude: '-46.6333'
      },
      openingHours: 'Mo-Fr 09:00-18:00',
      serviceType: [
        'Desenvolvimento Web',
        'APIs RESTful',
        'Aplicações Angular',
        'Sistemas Node.js',
        'Consultoria Técnica'
      ],
      areaServed: {
        '@type': 'Country',
        name: 'Brasil'
      }
    };
  }

  getProjectGallerySchema(project: Project) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: `Galeria - ${project.title}`,
      description: `Screenshots e demonstrações do projeto ${project.title}`,
      url: `${this.baseUrl}/projeto/${project.id}`,
      about: {
        '@type': 'Thing',
        name: project.title,
        description: project.description
      },
      associatedMedia: project.images.map((img: string, index: number) => ({
        '@type': 'ImageObject',
        name: `${project.title} - Imagem ${index + 1}`,
        description: `Screenshot do projeto ${project.title}`,
        contentUrl: `${this.baseUrl}${img}`,
        thumbnailUrl: `${this.baseUrl}${img}`
      }))
    };
  }

  getTechArticleSchema(project: Project) {
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${project.title} - Análise Técnica`,
      description: project.fullDescription || project.description,
      image: project.images.map((img: string) => `${this.baseUrl}${img}`),
      author: {
        '@type': 'Person',
        name: 'Ivan Reis'
      },
      publisher: {
        '@type': 'Person',
        name: 'Ivan Reis'
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/projeto/${project.id}`
      },
      about: {
        '@type': 'SoftwareApplication',
        name: project.title,
        applicationCategory: 'DeveloperApplication'
      },
      programmingLanguage: project.technologies,
      dependencies: project.technologies
    };
  }
}