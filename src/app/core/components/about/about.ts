import { Component, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CardStacks } from '../card-stacks/card-stacks';
import { Title } from "../typography/title/title";

@Component({
  selector: 'app-about',
  imports: [CardStacks, Title],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const section = this.elementRef.nativeElement.querySelector('#sobre');
      const cardsContainer = this.elementRef.nativeElement.querySelector('.stacks > div');
      const containt = this.elementRef.nativeElement.querySelector('.content');

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (cardsContainer) cardsContainer.classList.add('active');
              if (containt) containt.classList.add('active');
            } else {
              if (cardsContainer) cardsContainer.classList.remove('active');
              if (containt) containt.classList.remove('active');
            }
          });
        },
        {
          threshold: 0.3,
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
