import { Component, Input, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() activeSection: string = 'inicio';
  isMenuOpen: boolean = false;

  private readonly platformId = inject(PLATFORM_ID);

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
    // Also lock the scroll container
    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
  }
}
