import { Component, signal, ViewChild, ElementRef, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Home, About, Footer, Projects, Education, Contact, NgxParticlesModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected readonly title = signal('portfolio');
  activeSection = signal('inicio');

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

  // Check if running in browser
  protected readonly isBrowser = isPlatformBrowser(this.platformId);

  isHomePage() {
    return this.router.url === '/' || this.router.url === '' || this.router.url.startsWith('/#');
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // Skip browser-only initialization during SSR
    if (!isPlatformBrowser(this.platformId)) return;

    // Only setup scroll handling when on home page
    if (!this.scrollContainer?.nativeElement) return;

    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });

    setTimeout(() => {
      this.onScroll();
      this.scrollContainer.nativeElement.focus();
    }, 100);
    this.scrollContainer.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateToSection(e.key === 'ArrowDown' ? 'next' : 'prev');
      }
    });

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
