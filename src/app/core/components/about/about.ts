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
  experiencia = new Date().getFullYear() - 2022;
  
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
    const section = this.elementRef.nativeElement.querySelector('#sobre');
    const cardsContainer = this.elementRef.nativeElement.querySelector('.stacks > div');
    const containt = this.elementRef.nativeElement.querySelector('.content');

    this.observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => this.updateVisibility(entry.isIntersecting, cardsContainer, containt)),
      { threshold: 0.1 }
    );

    if (section) {
      this.observer.observe(section);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private updateVisibility(visible: boolean, cardsContainer: Element | null, content: Element | null): void {
    cardsContainer?.classList.toggle('active', visible);
    content?.classList.toggle('active', visible);
  }
}
