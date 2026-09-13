import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProjectCarousel } from '../project-carousel/project-carousel';
import { Title } from '../typography/title/title';

@Component({
  selector: 'app-projects',
  imports: [ProjectCarousel, Title],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  readonly isVisible = signal(false);

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
    const section = this.elementRef.nativeElement.querySelector('#projetos');

    this.observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => this.updateVisibility(entry)),
      { threshold: 0.1 }
    );

    if (section) {
      this.observer.observe(section);
    }
  }

  private updateVisibility(entry: IntersectionObserverEntry): void {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('active');
    this.isVisible.set(true);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
