import { Component, signal, ViewChild, ElementRef, AfterViewInit, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NgxParticlesModule } from "@tsparticles/angular";
import { Engine, IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import { Header } from './core/components/header/header';
import { About } from './core/components/about/about';
import { Home } from './core/components/home/home';
import { Footer } from './core/components/footer/footer';
import { Projects } from "./core/components/projects/projects";
import { Education } from "./core/components/education/education";
import { Contact } from "./core/components/contact/contact";
import { SEOService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Home, About, Footer, Projects, Education, Contact, NgxParticlesModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected readonly title = signal('portfolio');
  activeSection = signal('inicio');
  private readonly seoService = inject(SEOService);

  // Init function for particles
  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }

  // Particles Options
  particlesOptions: RecursivePartial<IOptions> = {
    fpsLimit: 120,
    fullScreen: { enable: true, zIndex: 50 }, // Above content but with pointer-events: none
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: { enable: true, mode: "repulse" },
        resize: { enable: true }
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: false,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: "out",
        random: true,
        speed: 0.8,
        straight: false,
      },
      number: { density: { enable: true, width: 800 }, value: 50 }, // Reduced from 80 for better mobile performance
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
    style: {
      pointerEvents: 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%'
    }
  };

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly isHomePage = signal(true);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.updateIsHomePage();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event) => {
      const urlWithoutFragment = event.urlAfterRedirects.split('#')[0];
      const isHome = urlWithoutFragment === '/' || urlWithoutFragment === '';
      this.isHomePage.set(isHome);

      if (isHome) {
        this.setHomeSEO();
        setTimeout(() => {
          this.initializeScrollHandling();

          const fragment = event.urlAfterRedirects.split('#')[1];
          if (fragment) {
            this.scrollToSection(fragment);
          }
        }, 50);
      }
    });

    if (this.isHomePage()) {
      this.setHomeSEO();
      this.initializeScrollHandling();
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          const sectionId = target.getAttribute('href')?.substring(1);
          if (sectionId) {
            this.scrollToSection(sectionId);
          }
        }
      });
    }
  }

  private updateIsHomePage(): void {
    const urlWithoutFragment = this.router.url.split('#')[0];
    this.isHomePage.set(urlWithoutFragment === '/' || urlWithoutFragment === '');
  }

  private setHomeSEO(): void {
    this.seoService.setBasicSEO({
      title: 'Ivan Reis - Desenvolvedor Full Stack',
      description: 'Desenvolvedor full stack brasileiro especializado em Angular, TypeScript e Node.js. Portfolio com projetos inovadores como Provei.ai, sistemas para e-commerce e aplicações web modernas.',
      keywords: ['desenvolvedor full stack', 'programador angular', 'web developer brasil', 'freelancer ti', 'typescript', 'nestjs'],
      type: 'website',
      url: 'https://ivanreis.com.br',
      locale: 'pt_BR'
    });
    this.seoService.setPersonSEO();
  }

  private initializeScrollHandling(): void {
    if (!this.scrollContainer?.nativeElement) return;

    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });

    setTimeout(() => {
      this.onScroll();
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.focus();
      }
    }, 100);

    this.scrollContainer.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateToSection(e.key === 'ArrowDown' ? 'next' : 'prev');
      }
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const container = this.scrollContainer.nativeElement;

    container.scrollTo({
      top: element.offsetTop,
      behavior: 'smooth'
    });

    this.activeSection.set(sectionId);
  }

  navigateToSection(direction: 'next' | 'prev') {
    const sections = ['inicio', 'sobre', 'projetos', 'progresso', 'contato'];
    const currentIndex = sections.indexOf(this.activeSection());

    let targetIndex: number;
    if (direction === 'next') {
      targetIndex = Math.min(currentIndex + 1, sections.length - 1);
    } else {
      targetIndex = Math.max(currentIndex - 1, 0);
    }

    this.scrollToSection(sections[targetIndex]);
  }

  onScroll() {
    const sections = ['inicio', 'sobre', 'projetos', 'progresso', 'contato'];
    const container = this.scrollContainer.nativeElement;
    const scrollPosition = container.scrollTop;

    let currentSection = 'inicio';

    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element) {
        const elementTop = element.offsetTop;
        if (scrollPosition >= elementTop - 100) {
          currentSection = sections[i];
          break;
        }
      }
    }

    if (this.activeSection() !== currentSection) {
      this.activeSection.set(currentSection);
    }
  }
}