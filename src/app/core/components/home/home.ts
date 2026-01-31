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
    if (isPlatformBrowser(this.platformId)) {
      const section = this.elementRef.nativeElement.querySelector('#inicio');

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reset');
              entry.target.classList.remove('active');

              setTimeout(() => {
                entry.target.classList.remove('reset');
                entry.target.classList.add('active');
              }, 50);
            } else {
              entry.target.classList.remove('active');
              entry.target.classList.remove('reset');
            }
          });
        },
        {
          threshold: 0.3
        }
      );

      if (section) {
        this.observer.observe(section);
      }
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
