import { Component, signal, ViewChild, ElementRef, AfterViewInit, inject, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Header } from './core/components/header/header';
import { About } from './core/components/about/about';
import { Home } from './core/components/home/home';
import { Footer } from './core/components/footer/footer';
import { Projects } from "./core/components/projects/projects";
import { Education } from "./core/components/education/education";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Home, About, Footer, Projects, Education],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected readonly title = signal('portfolio');
  activeSection = signal('inicio');

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  // Track if we're on the home page
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: '/' }
  );

  isHomePage = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url === '' || url.startsWith('/#');
  });

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // Skip browser-only initialization during SSR
    if (!isPlatformBrowser(this.platformId)) return;

    // Only setup scroll handling when on home page
    if (!this.scrollContainer?.nativeElement) return;

    // Adicionar listener de scroll
    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });

    // Detectar seção inicial após um pequeno delay
    setTimeout(() => {
      this.onScroll();
      // Dar foco ao container para permitir navegação por teclado
      this.scrollContainer.nativeElement.focus();
    }, 100);

    // Navegação por teclado
    this.scrollContainer.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateToSection(e.key === 'ArrowDown' ? 'next' : 'prev');
      }
    });

    // Interceptar cliques nos links da navbar
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

  scrollToSection(sectionId: string) {
    const sections = ['inicio', 'sobre', 'projetos', 'educacao', 'blog', 'contato'];
    const sectionIndex = sections.indexOf(sectionId);

    if (sectionIndex === -1) return;

    const container = this.scrollContainer.nativeElement;
    const viewportHeight = container.clientHeight;

    // Cada seção tem altura de 100vh
    const targetScrollPosition = sectionIndex * viewportHeight;

    container.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth'
    });

    // Atualizar activeSection imediatamente
    this.activeSection.set(sectionId);
  }

  navigateToSection(direction: 'next' | 'prev') {
    const sections = ['inicio', 'sobre', 'projetos', 'educacao', 'blog', 'contato'];
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
    const sections = ['inicio', 'sobre', 'projetos', 'educacao', 'blog', 'contato'];
    const container = this.scrollContainer.nativeElement;
    const scrollPosition = container.scrollTop;

    let currentSection = 'inicio';

    // Percorrer as seções de trás para frente
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element) {
        const elementTop = element.offsetTop;
        // Considera a seção ativa se o scroll passou do início dela
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
