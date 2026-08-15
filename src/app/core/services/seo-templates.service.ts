export interface SEOTemplate {
  title: string;
  description: string;
  keywords: string[];
  og: {
    title: string;
    description: string;
    image: string;
    type: string;
    locale: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
    creator: string;
    site: string;
  };
  jsonLd: object;
}

export class SEOTemplates {
  private readonly baseUrl = 'https://ivanreis.com.br';

  getHomeTemplate(): SEOTemplate {
    return {
      title: 'Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
      description: 'Tech Lead e Desenvolvedor Full Stack com 4+ anos criando soluções escaláveis com IA, automações e APIs robustas. NestJS, React, Next.js, Angular, FastAPI, AWS e PostgreSQL.',
      keywords: [
        'tech lead',
        'desenvolvedor full stack',
        'ivanreis.com.br',
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
      og: {
        title: 'Ivan Reis - Tech Lead & Desenvolvedor Full Stack | Portfólio',
        description: 'Tech Lead e Full Stack com 4+ anos criando soluções escaláveis com IA, automações e APIs robustas. NestJS, React, Next.js, Angular, AWS.',
        image: `${this.baseUrl}/images/og-home.jpg`,
        type: 'website',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
        description: 'Soluções escaláveis com IA, automações e APIs robustas. NestJS, React, Next.js, Angular, AWS e PostgreSQL.',
        image: `${this.baseUrl}/images/og-home.jpg`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Ivan Reis - Portfólio',
        url: this.baseUrl,
        description: 'Portfólio profissional de Ivan Reis, Tech Lead e Desenvolvedor Full Stack especializado em soluções escaláveis com inteligência artificial.',
        author: {
          '@type': 'Person',
          name: 'Ivan Reis'
        },
        inLanguage: 'pt-BR',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${this.baseUrl}/buscar?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    };
  }

  getProjectTemplate(project: any): SEOTemplate {
    const title = `${project.title} - Ivan Reis | Portfólio de Desenvolvimento`;
    const description = project.description.length > 160 
      ? project.description.substring(0, 157) + '...' 
      : project.description;
    
    return {
      title,
      description,
      keywords: [
        ...project.technologies,
        project.title.toLowerCase(),
        'ivan reis',
        'portfólio desenvolvedor',
        'desenvolvimento web',
        'full-stack',
        'angular',
        'nodejs',
        'typescript',
        'projeto web',
        'aplicação web'
      ],
      og: {
        title: `${project.title} - Ivan Reis`,
        description,
        image: `${this.baseUrl}${project.images[0]}`,
        type: 'article',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description,
        image: `${this.baseUrl}${project.images[0]}`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
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
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        programmingLanguage: project.technologies.filter((tech: string) => 
          ['JavaScript', 'TypeScript', 'Python', 'PHP', 'Java'].includes(tech)
        ),
        offers: project.demoUrl ? {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL'
        } : undefined,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '12'
        }
      }
    };
  }

  getAboutTemplate(): SEOTemplate {
    return {
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
        'automação',
        'segurança cibernética',
        'ciência de dados'
      ],
      og: {
        title: 'Sobre Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
        description: 'Tech Lead com 4+ anos de experiência. Especialista em soluções escaláveis com IA, automações e APIs robustas.',
        image: `${this.baseUrl}/images/og-about.jpg`,
        type: 'profile',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Sobre Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
        description: 'Tech Lead com 4+ anos. NestJS, React, Next.js, Angular, FastAPI, AWS, IA e automações.',
        image: `${this.baseUrl}/images/og-about.jpg`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Ivan Reis',
        jobTitle: 'Tech Lead & Desenvolvedor Full Stack',
        description: 'Tech Lead e Desenvolvedor Full Stack especializado em soluções escaláveis com inteligência artificial, automações e APIs robustas.',
        url: this.baseUrl,
        image: `${this.baseUrl}/images/profile-photo.jpg`,
        email: 'contato@ivanreis.com.br',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BR',
          addressRegion: 'Rio de Janeiro'
        },
        alumniOf: [
          {
            '@type': 'EducationalOrganization',
            name: 'UNINTER - Centro Universitário Internacional',
            addressCountry: 'BR'
          }
        ],
        knowsAbout: [
          'NestJS',
          'React',
          'Next.js',
          'Angular',
          'FastAPI',
          'TypeScript',
          'PostgreSQL',
          'MongoDB',
          'Redis',
          'Docker',
          'AWS',
          'Google Cloud',
          'Inteligência Artificial',
          'DevOps',
          'CI/CD'
        ],
        sameAs: [
          'https://linkedin.com/in/ivanreis',
          'https://github.com/Ivan-ReisDev',
          'https://twitter.com/ivanreis'
        ]
      }
    };
  }

  getContactTemplate(): SEOTemplate {
    return {
      title: 'Contato - Ivan Reis | Tech Lead & Desenvolvedor Full Stack',
      description: 'Entre em contato com Ivan Reis. Disponível para projetos de desenvolvimento, automações com IA, consultoria técnica e liderança de equipes.',
      keywords: [
        'contato ivan reis',
        'contratar tech lead',
        'desenvolvedor full stack',
        'consultoria técnica',
        'automação com ia',
        'orçamento desenvolvimento web',
        'projetos nestjs react angular',
        'liderança técnica',
        'desenvolvedor para contratar'
      ],
      og: {
        title: 'Contato - Ivan Reis | Tech Lead & Desenvolvedor Full Stack',
        description: 'Disponível para projetos de desenvolvimento, automações com IA, consultoria técnica e liderança de equipes.',
        image: `${this.baseUrl}/images/og-contact.jpg`,
        type: 'website',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Contato - Ivan Reis | Tech Lead & Full Stack',
        description: 'Disponível para projetos, automações com IA e consultoria técnica. Vamos conversar!',
        image: `${this.baseUrl}/images/og-contact.jpg`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Ivan Reis - Tech Lead & Desenvolvedor Full Stack',
        url: `${this.baseUrl}/contato`,
        telephone: '+55-21-98559-8348',
        email: 'contato@ivanreis.com.br',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BR',
          addressRegion: 'RJ'
        },
        openingHours: 'Mo-Fr 09:00-18:00',
        serviceType: [
          'Desenvolvimento Web Full Stack',
          'APIs e Microsserviços',
          'Automação com Inteligência Artificial',
          'Aplicações React/Next.js/Angular',
          'Sistemas NestJS/Express/FastAPI',
          'Consultoria Técnica',
          'Liderança de Equipes'
        ],
        areaServed: {
          '@type': 'Country',
          name: 'Brasil'
        }
      }
    };
  }

  getProveiAiTemplate(): SEOTemplate {
    return {
      title: 'Provei.ai – Provador Virtual | Ivan Reis | Portfólio',
      description: 'Plataforma de provador virtual para e-commerces com IA. Aumenta conversão e reduz devoluções. Desenvolvido com NestJS, Next.js, TypeScript e OpenAI API.',
      keywords: [
        'provei.ai',
        'provador virtual',
        'e-commerce ai',
        'realidade aumentada',
        'nestjs',
        'next.js',
        'typescript',
        'openai api',
        'plataforma e-commerce',
        'conversão online',
        'redução devoluções',
        'ivan reis'
      ],
      og: {
        title: 'Provei.ai – Provador Virtual com IA',
        description: 'Plataforma inovadora que aumenta conversão em e-commerces através de provador virtual com IA.',
        image: `${this.baseUrl}/images/provei-ai/provei-ai.png`,
        type: 'article',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Provei.ai – Provador Virtual',
        description: 'Plataforma de provador virtual para e-commerces que aumenta conversão e reduz devoluções.',
        image: `${this.baseUrl}/images/provei-ai/provei-ai.png`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Provei.ai – Provador Virtual',
        description: 'Plataforma de provador virtual para e-commerces, permitindo que clientes visualizem produtos em seu próprio ambiente antes da compra.',
        image: [
          `${this.baseUrl}/images/provei-ai/provei-ai.png`,
          `${this.baseUrl}/images/provei-ai/dashboard.png`,
          `${this.baseUrl}/images/provei-ai/furniture.png`
        ],
        url: 'https://provei.ai',
        author: {
          '@type': 'Person',
          name: 'Ivan Reis',
          url: this.baseUrl
        },
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        programmingLanguage: ['TypeScript', 'JavaScript', 'Python'],
        featureList: [
          'Provador virtual em tempo real',
          'Aumento da conversão',
          'Redução de devoluções',
          'Compatibilidade com e-commerces',
          'Integração plug-and-play'
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '23'
        }
      }
    };
  }

  getConstrutivaTemplate(): SEOTemplate {
    return {
      title: 'Landing Page Construtiva | Ivan Reis | Desenvolvimento Web',
      description: 'Landing page institucional para Construtiva Projetos e Reformas. Foco em conversão, SEO local e integração com WhatsApp. Desenvolvido com PHP, CSS, HTML.',
      keywords: [
        'landing page',
        'construtiva projetos e reformas',
        'desenvolvimento web',
        'seo local',
        'php',
        'css',
        'html',
        'conversão website',
        'whatsapp business',
        'construção civil',
        'reformas',
        'ivan reis'
      ],
      og: {
        title: 'Landing Page Construtiva Projetos e Reformas',
        description: 'Landing page institucional otimizada para conversão e SEO local no segmento de construção.',
        image: `${this.baseUrl}/images/construtiva/construtiva.png`,
        type: 'article',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Landing Page Construtiva',
        description: 'Website institucional para empresa de construção e reformas com foco em conversão.',
        image: `${this.baseUrl}/images/construtiva/construtiva.png`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Construtiva Projetos e Reformas',
        description: 'Landing page institucional desenvolvida para apresentação de serviços e captação de leads.',
        url: 'https://construtivaprojetos.com.br',
        image: [
          `${this.baseUrl}/images/construtiva/construtiva.png`,
          `${this.baseUrl}/images/projects/construtiva/hero.png`,
          `${this.baseUrl}/images/projects/construtiva/cta.png`
        ],
        author: {
          '@type': 'Person',
          name: 'Ivan Reis',
          url: this.baseUrl
        },
        mainEntity: {
          '@type': 'LocalBusiness',
          name: 'Construtiva Projetos e Reformas',
          url: 'https://construtivaprojetos.com.br',
          telephone: '+55-11-99999-9999',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'BR',
            addressRegion: 'SP'
          },
          serviceType: [
            'Projetos de Construção',
            'Reformas Residenciais',
            'Reformas Comerciais',
            'Consultoria em Obras'
          ]
        }
      }
    };
  }

  getEveryFansTemplate(): SEOTemplate {
    return {
      title: 'EveryFans – Plataforma para Criadores | Ivan Reis | Portfólio',
      description: 'Plataforma completa para gestão de conteúdo e automação para criadores. Auto-edição, agendamento, publicação automática e analytics. NestJS, React, TypeScript.',
      keywords: [
        'everyfans',
        'plataforma criadores',
        'gestão conteúdo',
        'automação redes sociais',
        'nestjs',
        'react',
        'typescript',
        'postgresql',
        'redis',
        'docker',
        'criadores conteúdo',
        'ivan reis'
      ],
      og: {
        title: 'EveryFans – Plataforma de Gestão para Criadores',
        description: 'Sistema completo para gestão de conteúdo e automação para criadores de conteúdo digitais.',
        image: `${this.baseUrl}/images/everyfans/everyfans.png`,
        type: 'article',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'EveryFans – Plataforma para Criadores',
        description: 'Plataforma completa que automatiza a rotina de criadores de conteúdo.',
        image: `${this.baseUrl}/images/everyfans/everyfans.png`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'EveryFans – Plataforma de Gestão para Criadores',
        description: 'Sistema completo para gestão de conteúdo e automação para criadores, reunindo ferramentas em um único painel.',
        image: [
          `${this.baseUrl}/images/everyfans/everyfans.png`,
          `${this.baseUrl}/images/projects/everyfans/dashboard.png`,
          `${this.baseUrl}/images/projects/everyfans/auto‑edicao.png`,
          `${this.baseUrl}/images/projects/everyfans/publicação‑automatica.png`
        ],
        url: 'https://www.everyfans.com.br/',
        author: {
          '@type': 'Person',
          name: 'Ivan Reis',
          url: this.baseUrl
        },
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        programmingLanguage: ['TypeScript', 'JavaScript'],
        featureList: [
          'Gestão de elenco e colaboradores',
          'Auto‑edição de vídeos e fotos',
          'Agendamento automático',
          'Publicação multiplataforma',
          'Analytics integrado',
          'Armazenamento seguro'
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock'
        }
      }
    };
  }

  get404Template(): SEOTemplate {
    return {
      title: 'Página Não Encontrada | Ivan Reis | Portfólio',
      description: 'A página que você procura não foi encontrada. Navegue pelo portfólio de Ivan Reis para conhecer projetos de desenvolvimento web.',
      keywords: [
        'pagina não encontrada',
        'erro 404',
        'ivan reis',
        'portfólio',
        'desenvolvedor web'
      ],
      og: {
        title: 'Página Não Encontrada',
        description: 'A página solicitada não foi encontrada. Volte ao portfólio principal.',
        image: `${this.baseUrl}/images/og-404.jpg`,
        type: 'website',
        locale: 'pt_BR'
      },
      twitter: {
        card: 'summary',
        title: 'Página Não Encontrada',
        description: 'Ops! A página que você procura não existe.',
        image: `${this.baseUrl}/images/og-404.jpg`,
        creator: '@ivanreis',
        site: '@ivanreis'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Página Não Encontrada',
        description: 'Página de erro 404 para Ivan Reis Portfólio',
        url: `${this.baseUrl}/404`
      }
    };
  }
}
