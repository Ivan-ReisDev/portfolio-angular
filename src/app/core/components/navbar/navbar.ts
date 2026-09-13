import { Component, Input, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() activeSection: string = 'inicio';
  isMenuOpen: boolean = false;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  navigateToSection(event: Event, sectionId: string) {
    event.preventDefault();
    this.closeMenu();

    const currentUrl = this.router.url.split('#')[0];
    const isHome = currentUrl === '/' || currentUrl === '';

    isHome ? this.scrollToSection(sectionId) : void this.router.navigate(['/'], { fragment: sectionId });
  }

  private scrollToSection(sectionId: string): void {
    const container = document.querySelector('.scroll-container') as HTMLElement | null;
    const sections = ['inicio', 'sobre', 'projetos', 'progresso', 'blog', 'contato'];
    const targetIndex = sections.indexOf(sectionId);
    if (!container || targetIndex < 0) return;
    const scrollTarget = sections.slice(0, targetIndex).reduce(
      (total, id) => total + (document.getElementById(id)?.getBoundingClientRect().height ?? 0), 0
    );
    container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.toggleBodyScroll();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.toggleBodyScroll();
  }

  private toggleBodyScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const overflow = this.isMenuOpen ? 'hidden' : '';
    document.body.style.overflow = overflow;
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement | null;
    scrollContainer?.style.setProperty('overflow', overflow);
  }
}
