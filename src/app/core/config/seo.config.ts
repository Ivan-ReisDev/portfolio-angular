export interface SEOConfiguration {
  site: {
    name: string;
    url: string;
    domain: string;
    author: string;
    email: string;
    phone: string;
    logo: string;
    favicon: string;
    language: string;
    country: string;
    timezone: string;
  };
  social: {
    twitter: {
      username: string;
      card: string;
    };
    facebook?: {
      appId?: string;
      admins?: string;
    };
    instagram?: {
      username: string;
    };
    linkedin: {
      url: string;
      company?: string;
    };
    github: {
      username: string;
    };
    youtube?: {
      channelId: string;
    };
  };
  verification: {
    google?: {
      siteVerification?: string;
      analyticsId?: string;
      tagManagerId?: string;
    };
    bing?: {
      siteVerification?: string;
    };
    yandex?: {
      siteVerification?: string;
    };
    pinterest?: {
      siteVerification?: string;
    };
  };
  business: {
    type: string;
    name: string;
    description: string;
    services: string[];
    serviceArea: {
      country: string;
      regions: string[];
    };
    hours: string;
    priceRange: string;
    currencies: string[];
  };
  seo: {
    titleTemplate: string;
    descriptionLength: {
      min: number;
      max: number;
    };
    keywordDensity: {
      min: number;
      max: number;
    };
    imageOptimization: {
      maxSize: number;
      formats: string[];
    };
    performance: {
      maxLoadTime: number;
      mobileFriendly: boolean;
      httpsEnabled: boolean;
    };
  };
  structuredData: {
    enablePerson: boolean;
    enableWebsite: boolean;
    enableOrganization: boolean;
    enableLocalBusiness: boolean;
    enableBreadcrumb: boolean;
    enableCreativeWork: boolean;
    enableArticle: boolean;
    enableTechArticle: boolean;
  };
}

export const SEO_CONFIG: SEOConfiguration = {
  site: {
    name: 'Ivan Reis - Portfólio',
    url: 'https://ivanreis.com.br',
    domain: 'ivanreis.com.br',
    author: 'Ivan Reis',
    email: 'contato@ivanreis.com.br',
    phone: '+55-11-99999-9999',
    logo: '/images/logo.jpg',
    favicon: '/favicon.ico',
    language: 'pt-BR',
    country: 'BR',
    timezone: 'America/Sao_Paulo'
  },
  social: {
    twitter: {
      username: '@ivanreis',
      card: 'summary_large_image'
    },
    facebook: {
      appId: '',
      admins: ''
    },
    instagram: {
      username: '@ivanreis'
    },
    linkedin: {
      url: 'https://linkedin.com/in/ivanreis',
      company: ''
    },
    github: {
      username: 'deeivan'
    },
    youtube: {
      channelId: ''
    }
  },
  verification: {
    google: {
      siteVerification: '',
      analyticsId: 'G-XXXXXXXXXX',
      tagManagerId: 'GTM-XXXXXX'
    },
    bing: {
      siteVerification: ''
    },
    yandex: {
      siteVerification: ''
    },
    pinterest: {
      siteVerification: ''
    }
  },
  business: {
    type: 'ProfessionalService',
    name: 'Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
    description: 'Tech Lead e Desenvolvedor Full Stack especializado em soluções escaláveis com inteligência artificial, automações, APIs robustas e deploy em cloud.',
    services: [
      'Desenvolvimento Web Full Stack',
      'APIs RESTful e Microsserviços',
      'Inteligência Artificial e Automação',
      'Aplicações Angular/React/Next.js',
      'Sistemas NestJS/Express/FastAPI',
      'Integração de Sistemas',
      'Consultoria Técnica',
      'Otimização de Performance',
      'Desenvolvimento de E-commerce',
      'Automação de Processos com IA',
      'Cloud Computing (AWS, Google Cloud)',
      'DevOps e CI/CD'
    ],
    serviceArea: {
      country: 'Brasil',
      regions: [
        'São Paulo',
        'Rio de Janeiro',
        'Minas Gerais',
        'Paraná',
        'Santa Catarina',
        'Rio Grande do Sul',
        'Bahia',
        'Pernambuco',
        'Ceará',
        'Distrito Federal'
      ]
    },
    hours: 'Mo-Fr 09:00-18:00',
    priceRange: '$$',
    currencies: ['BRL', 'USD', 'EUR']
  },
  seo: {
    titleTemplate: '%title% | Ivan Reis | %siteName%',
    descriptionLength: {
      min: 120,
      max: 160
    },
    keywordDensity: {
      min: 1,
      max: 3
    },
    imageOptimization: {
      maxSize: 500,
      formats: ['webp', 'jpg', 'png', 'avif']
    },
    performance: {
      maxLoadTime: 3,
      mobileFriendly: true,
      httpsEnabled: true
    }
  },
  structuredData: {
    enablePerson: true,
    enableWebsite: true,
    enableOrganization: true,
    enableLocalBusiness: true,
    enableBreadcrumb: true,
    enableCreativeWork: true,
    enableArticle: true,
    enableTechArticle: true
  }
};

export const SEO_TEMPLATES = {
  home: {
    title: 'Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
    description: 'Tech Lead e Desenvolvedor Full Stack com 4+ anos criando soluções escaláveis com IA. NestJS, React, Next.js, Angular, FastAPI, AWS e PostgreSQL.',
    keywords: [
      'tech lead',
      'desenvolvedor full stack',
      'inteligência artificial',
      'automação',
      'nestjs',
      'react',
      'nextjs',
      'angular',
      'fastapi',
      'typescript',
      'postgresql',
      'aws',
      'docker',
      'devops'
    ],
    image: '/images/og-home.jpg'
  },
  about: {
    title: 'Sobre Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
    description: 'Tech Lead com 4+ anos de experiência em NestJS, React, Next.js, Angular, FastAPI, AWS e IA. Graduado em ADS, com pós-graduações em Ciências de Dados e IA e em Segurança Cibernética pela UNINTER.',
    keywords: [
      'sobre ivan reis',
      'currículo ivan reis',
      'tech lead',
      'desenvolvedor full stack',
      'experiência profissional',
      'nestjs',
      'react',
      'angular',
      'inteligência artificial',
      'automação'
    ],
    image: '/images/og-about.jpg'
  },
  contact: {
    title: 'Contato - Ivan Reis | Tech Lead & Desenvolvedor Full Stack',
    description: 'Entre em contato com Ivan Reis. Disponível para projetos de desenvolvimento, automações com IA, consultoria técnica e liderança de equipes.',
    keywords: [
      'contato ivan reis',
      'contratar tech lead',
      'desenvolvedor full stack',
      'consultoria técnica',
      'automação com ia',
      'orçamento desenvolvimento web',
      'projetos nestjs react angular'
    ],
    image: '/images/og-contact.jpg'
  },
  project: {
    titleTemplate: '%projectTitle% - Ivan Reis | Portfólio',
    descriptionTemplate: '%projectDescription% - Desenvolvido com %technologies% por Ivan Reis.',
    keywordsTemplate: [
      '%projectTitle%',
      '%technologies%',
      'ivan reis',
      'portfólio desenvolvedor',
      'desenvolvimento web',
      'full-stack',
      'projeto web'
    ]
  },
  error: {
    title: 'Página Não Encontrada | Ivan Reis | Portfólio',
    description: 'A página que você procura não foi encontrada. Navegue pelo portfólio de Ivan Reis para conhecer projetos.',
    keywords: [
      'pagina não encontrada',
      'erro 404',
      'ivan reis',
      'portfólio',
      'desenvolvedor web'
    ],
    image: '/images/og-404.jpg'
  }
};

export const OPEN_GRAPH_TEMPLATES = {
  website: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ivan Reis - Portfólio'
  },
  article: {
    type: 'article',
    locale: 'pt_BR',
    siteName: 'Ivan Reis - Portfólio',
    section: 'Portfólio'
  },
  profile: {
    type: 'profile',
    locale: 'pt_BR',
    siteName: 'Ivan Reis - Portfólio'
  }
};

export const TWITTER_CARD_TEMPLATES = {
  summary: {
    card: 'summary',
    creator: '@ivanreis',
    site: '@ivanreis'
  },
  summary_large: {
    card: 'summary_large_image',
    creator: '@ivanreis',
    site: '@ivanreis'
  }
};

export const STRUCTURED_DATA_CONFIG = {
  person: {
    context: 'https://schema.org',
    type: 'Person'
  },
  website: {
    context: 'https://schema.org',
    type: 'WebSite'
  },
  organization: {
    context: 'https://schema.org',
    type: 'Organization'
  },
  localBusiness: {
    context: 'https://schema.org',
    type: 'ProfessionalService'
  },
  softwareApplication: {
    context: 'https://schema.org',
    type: 'SoftwareApplication'
  },
  article: {
    context: 'https://schema.org',
    type: 'Article'
  },
  techArticle: {
    context: 'https://schema.org',
    type: 'TechArticle'
  },
  breadcrumb: {
    context: 'https://schema.org',
    type: 'BreadcrumbList'
  },
  imageGallery: {
    context: 'https://schema.org',
    type: 'ImageGallery'
  }
};

export const SITEMAP_CONFIG = {
  baseUrl: 'https://ivanreis.com.br',
  changeFreq: {
    home: 'weekly',
    projects: 'monthly',
    about: 'monthly',
    contact: 'yearly'
  },
  priority: {
    home: 1.0,
    projects: 0.8,
    about: 0.6,
    contact: 0.4
  }
};
