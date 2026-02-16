import { Component, signal, ViewChild, ElementRef, AfterViewInit, inject, PLATFORM_ID, DestroyRef, OnDestroy } from '@angular/core';
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
import { Toast } from './core/components/dashboard/toast/toast';
import { Preloader } from './core/components/preloader/preloader';
import { Noah } from './core/components/noah/noah';
import { BlogPreview } from './core/components/blog-preview/blog-preview';
import { SEOService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Home, About, Footer, Projects, Education, BlogPreview, Contact, NgxParticlesModule, Toast, Preloader, Noah],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('portfolio');
  activeSection = signal('inicio');
  private readonly seoService = inject(SEOService);

  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }

  particlesOptions: RecursivePartial<IOptions> = {
    fpsLimit: 60,
    fullScreen: { enable: true, zIndex: 50 },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: { enable: false },
        resize: { enable: true }
      },
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
      number: { density: { enable: true, width: 800 }, value: 50 },
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

  private scrollHandler: (() => void) | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private scrollRafId = 0;
  private scrollHandlingInitialized = false;

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
      } else {
        this.destroyScrollHandling();
      }
    });

    if (this.isHomePage()) {
      this.setHomeSEO();
      this.initializeScrollHandling();
    }

    this.setupGlobalClickInterceptor();
  }

  ngOnDestroy(): void {
    this.destroyScrollHandling();
    this.removeGlobalClickInterceptor();
    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
    }
  }

  private setupGlobalClickInterceptor(): void {
    if (typeof document === 'undefined' || this.clickHandler) return;

    this.clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const sectionId = target.getAttribute('href')?.substring(1);
        if (sectionId) {
          this.scrollToSection(sectionId);
        }
      }
    };

    document.addEventListener('click', this.clickHandler);
  }

  private removeGlobalClickInterceptor(): void {
    if (this.clickHandler && typeof document !== 'undefined') {
      document.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  private updateIsHomePage(): void {
    const urlWithoutFragment = this.router.url.split('#')[0];
    this.isHomePage.set(urlWithoutFragment === '/' || urlWithoutFragment === '');
  }

  private setHomeSEO(): void {
    this.seoService.setBasicSEO({
      title: 'Ivan Reis - Desenvolvedor Full Stack',
      description: 'Desenvolvedor full stack brasileiro especializado em Angular, TypeScript e Node.js. Portfólio com projetos inovadores como Provei.ai, sistemas para e-commerce e aplicações web modernas.',
      keywords: ['desenvolvedor full stack', 'programador angular', 'web developer brasil', 'freelancer ti', 'typescript', 'nestjs'],
      type: 'website',
      url: 'https://ivanreis.com.br',
      locale: 'pt_BR'
    });
    this.seoService.setPersonSEO();
  }

  private initializeScrollHandling(): void {
    if (!this.scrollContainer?.nativeElement) return;

    if (this.scrollHandlingInitialized) return;
    this.scrollHandlingInitialized = true;

    const container = this.scrollContainer.nativeElement;

    this.scrollHandler = () => {
      if (this.scrollRafId) return;
      this.scrollRafId = requestAnimationFrame(() => {
        this.scrollRafId = 0;
        this.onScroll();
      });
    };

    container.addEventListener('scroll', this.scrollHandler, { passive: true });

    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateToSection(e.key === 'ArrowDown' ? 'next' : 'prev');
      }
    };

    container.addEventListener('keydown', this.keydownHandler);

    setTimeout(() => {
      this.onScroll();
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.focus();
      }
    }, 100);
  }

  private destroyScrollHandling(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) return;

    if (this.scrollHandler) {
      container.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.keydownHandler) {
      container.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }

    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = 0;
    }

    this.scrollHandlingInitialized = false;
  }

  scrollToSection(sectionId: string) {
    if (!this.scrollContainer?.nativeElement) return;

    const container = this.scrollContainer.nativeElement;
    const sections = ['inicio', 'sobre', 'projetos', 'progresso', 'blog', 'contato'];
    const targetIndex = sections.indexOf(sectionId);
    if (targetIndex === -1) return;

    let scrollTarget = 0;
    for (let i = 0; i < targetIndex; i++) {
      const el = document.getElementById(sections[i]);
      if (el) {
        scrollTarget += el.getBoundingClientRect().height;
      }
    }

    container.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });

    this.activeSection.set(sectionId);
  }

  navigateToSection(direction: 'next' | 'prev') {
    const sections = ['inicio', 'sobre', 'projetos', 'progresso', 'blog', 'contato'];
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
    if (!this.scrollContainer?.nativeElement) return;

    const sections = ['inicio', 'sobre', 'projetos', 'progresso', 'blog', 'contato'];
    const container = this.scrollContainer.nativeElement;
    const scrollPosition = container.scrollTop;

    let currentSection = 'inicio';
    let accumulatedHeight = 0;

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (!element) continue;

      if (scrollPosition >= accumulatedHeight - 100) {
        currentSection = sectionId;
      }
      accumulatedHeight += element.getBoundingClientRect().height;
    }

    if (this.activeSection() !== currentSection) {
      this.activeSection.set(currentSection);
    }
  }
}
