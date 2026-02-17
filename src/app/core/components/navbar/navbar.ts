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

    if (isHome) {
      const container = document.querySelector('.scroll-container') as HTMLElement;
      if (!container) return;

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

      container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    } else {
      this.router.navigate(['/'], { fragment: sectionId });
    }
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
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
  }
}
