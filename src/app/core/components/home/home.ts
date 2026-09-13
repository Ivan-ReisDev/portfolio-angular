import { Component, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initializeObserver();
  }

  private initializeObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    const section = this.elementRef.nativeElement.querySelector('#inicio');

    this.observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle('active', entry.isIntersecting)),
      { threshold: 0.3 }
    );

    if (section) {
      this.observer.observe(section);
    }
  }

  scrollToNextSection() {
    if (isPlatformBrowser(this.platformId)) {
      const currentSection = this.elementRef.nativeElement;
      const nextSection = currentSection.nextElementSibling;
      
      if (nextSection) {
        nextSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
