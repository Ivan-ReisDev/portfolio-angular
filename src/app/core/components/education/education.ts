import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Title } from '../typography/title/title';

type TimelineItem = {
  date: string;
  title: string;
  description?: string;
  descriptionParts?: {
    text: string;
    highlighted?: boolean;
  }[];
};

@Component({
  selector: 'app-education',
  imports: [Title],
  templateUrl: './education.html',
  styleUrl: './education.scss',
  animations: [
    trigger('timelineItemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)', maxHeight: '0px' }),
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)', maxHeight: '500px' })),
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0, transform: 'translateY(-15px)', maxHeight: '0px' })),
      ]),
    ]),
  ],
})
export class Education {
  showAll = false;
  initialItemsCount = 3;

  timeline: TimelineItem[] = [
    {
      date: 'Agosto 2026',
      title: 'Pós-Graduações em Tecnologia - UNINTER',
      descriptionParts: [
        { text: 'Conclusão das pós-graduações em ' },
        { text: 'Ciências de Dados e Inteligência Artificial', highlighted: true },
        { text: ' e em ' },
        { text: 'Segurança e Defesa Cibernética', highlighted: true },
        {
          text: ' no Centro Universitário Internacional UNINTER. As formações ampliaram meus conhecimentos em análise e modelagem de dados, aprendizado de máquina, inteligência artificial, proteção de dados, análise de vulnerabilidades, resposta a incidentes, criptografia e segurança ofensiva e defensiva.',
        },
      ],
    },
    {
      date: 'Junho 2026',
      title: 'Desenvolvedor Full Stack Pleno - Youdata',
      description:
        'Atuação como Desenvolvedor Full Stack Pleno, alocado na Ancar, participando de todo o ciclo de desenvolvimento de aplicações web, desde o levantamento de requisitos e alinhamento com as áreas de negócio até o desenvolvimento, arquitetura e deploy em produção. Desenvolvimento de soluções utilizando TypeScript, React, Node.js, Express e NestJS, além da criação e evolução de APIs, integrações entre sistemas e implementação de novas funcionalidades. Experiência com o ecossistema Google Cloud Platform (GCP), atuando na infraestrutura e implantação de aplicações com foco em performance, escalabilidade e boas práticas de desenvolvimento.',
    },
    {
      date: 'Dezembro 2025',
      title: 'Desenvolvedor Full Stack - BSN Tecnologia',
      description:
        'Atuação no desenvolvimento e manutenção de CRMs, ERPs e aplicações personalizadas utilizando PHP (Laravel e Symfony), .NET, Angular (Ionic) e MySQL, realizando integrações com APIs de terceiros, incluindo a API do Banco do Brasil, além da manutenção de servidores por meio de File Manager. Trabalho com a metodologia ágil Kanban, participando da implementação de novas funcionalidades, correção de bugs e melhorias contínuas, com atuação em projetos para grandes clientes, como Invista (C6 Bank) e CAOA Chery, desenvolvendo soluções alinhadas às necessidades do negócio.',
    },
    {
      date: 'Janeiro 2025',
      title: 'Reverbs Tecnologia - Tech Lead/Desenvolvedor Full Stack',
      description:
        'Atuação como Tech Lead e Desenvolvedor Full Stack, liderando projetos de desenvolvimento web e APIs, com foco em arquitetura, escalabilidade e boas práticas. Criação de automações robustas e aplicações que utilizam inteligência artificial, além da implementação de soluções escaláveis com NestJS, Next.js, React (Vite), Redis, AWS, PostgreSQL, Docker, FastAPI, Google Cloud Compute e Supabase. Responsável também pela configuração e manutenção de pipelines de CI/CD com GitHub Actions, automatizando testes, builds e deploys.',
    },
    {
      date: 'Dezembro 2024',
      title: 'Graduação em Análise e Desenvolvimento de Sistemas — UNINTER',
      description:
        'Formado com competências em desenvolvimento de software, testes e análise de sistemas. Durante o curso, adquiri conhecimentos em diversas linguagens de programação, metodologias ágeis e boas práticas de desenvolvimento, preparando-me para atuar de forma eficaz no mercado de tecnologia, Durante a formação fiz vários cursos extra curriculares para complementar o aprendizado.  ',
    },
    {
      date: 'Agosto 2024',
      title: 'RA1 Tecnologia - Desenvolvedor Full Stack',
      description:
        'Atuação no desenvolvimento de uma plataforma SaaS voltada à automação de postagens e geração de conteúdo, com uso de inteligência artificial. A solução realizava agendamento e publicação automática em blogs integrados ao CMS Ghost, além de integração com Stripe para gerenciamento de assinaturas e pagamentos. O sistema foi desenvolvido com Next.js no frontend e backend, utilizando MongoDB como banco de dados, incluindo também criação, customização e manutenção de temas para o Ghost CMS.',
    },
    {
      date: 'Maio 2023',
      title: 'Freelancer Full Stack Developer',
      description:
        'Atuação como Desenvolvedor Full Stack Freelancer, responsável pelo desenvolvimento do meu primeiro projeto full stack: um sistema completo de gestão de funcionários para uma comunidade online inspirada no Habbo Hotel. O sistema contemplava funcionalidades administrativas essenciais, incluindo controle de cargos, permissões, usuários e fluxos internos, sendo desenvolvido com Node.js (Express) no backend e React no frontend.',
    },
    {
      date: 'Julho 2022',
      title: 'Graduação em Análise e Desenvolvimento de Sistemas — UNINTER',
      description:
        'Iniciei a graduação focado em programação, modelagem de dados e desenvolvimento web/mobile.',
    },
  ];

  get visibleItems(): TimelineItem[] {
    return this.showAll ? this.timeline : this.timeline.slice(0, this.initialItemsCount);
  }

  toggleShowMore(): void {
    this.showAll = !this.showAll;
  }
}
