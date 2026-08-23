import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProjectCarousel } from '../project-carousel/project-carousel';
import { Title } from '../typography/title/title';

type InternalProject = {
  name: string;
  company: string;
  description: string;
};

@Component({
  selector: 'app-projects',
  imports: [ProjectCarousel, Title],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  readonly isVisible = signal(false);
  // Temporary content used only to validate the layout before adding real projects.
  readonly internalProjects: InternalProject[] = [
    {
      name: 'Atlas Workspace',
      company: 'Empresa Alpha',
      description:
        'Plataforma interna para centralizar operações, automatizar fluxos entre equipes e acompanhar indicadores importantes em tempo real.',
    },
    {
      name: 'Pulse Finance',
      company: 'Empresa Beta',
      description:
        'Sistema de gestão financeira criado para consolidar dados, reduzir tarefas manuais e tornar o fechamento mensal mais previsível.',
    },
    {
      name: 'Sentinel Hub',
      company: 'Empresa Gamma',
      description:
        'Solução de monitoramento que integra diferentes serviços, identifica eventos críticos e facilita a resposta das equipes responsáveis.',
    },
  ];

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const section = this.elementRef.nativeElement.querySelector('#projetos');

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              this.isVisible.set(true);
            }
          });
        },
        {
          threshold: 0.1,
        }
      );

      if (section) {
        this.observer.observe(section);
      }
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
