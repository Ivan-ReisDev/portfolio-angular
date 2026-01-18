import {
  Component,
  inject,
  signal,
  computed,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

import { ProjectService } from '../../services/project.service';
import { ProjectCard } from '../project-card/project-card';
import { SwipeDirective } from '../../directives/swipe.directive';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

@Component({
  selector: 'app-project-carousel',
  standalone: true,
  imports: [ProjectCard, SwipeDirective],
  templateUrl: './project-carousel.html',
  styleUrl: './project-carousel.scss'
})
export class ProjectCarousel {
  private readonly projectService = inject(ProjectService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly platformId = inject(PLATFORM_ID);

  // Projects from service
  readonly projects = this.projectService.projects;
  readonly loading = this.projectService.loading;

  // Carousel state
  readonly currentIndex = signal(0);

  // Responsive viewport mode
  readonly viewportMode = toSignal(
    this.breakpointObserver.observe([
      '(max-width: 767px)',
      '(min-width: 768px) and (max-width: 1023px)',
      '(min-width: 1024px)'
    ]).pipe(
      map(result => {
        if (result.breakpoints['(max-width: 767px)']) return 'mobile' as ViewportMode;
        if (result.breakpoints['(min-width: 768px) and (max-width: 1023px)']) return 'tablet' as ViewportMode;
        return 'desktop' as ViewportMode;
      })
    ),
    { initialValue: 'desktop' as ViewportMode }
  );

  // Navigation state
  readonly canGoNext = computed(() =>
    this.currentIndex() < this.projects().length - 1
  );

  readonly canGoPrev = computed(() =>
    this.currentIndex() > 0
  );

  // Whether to show carousel mode (desktop/tablet) or stacked mode (mobile)
  readonly isCarouselMode = computed(() =>
    this.viewportMode() !== 'mobile'
  );

  // Get position class for each card index relative to current
  getCardPosition(index: number): string {
    const current = this.currentIndex();
    const diff = index - current;

    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    if (diff < -1) return 'far-left';
    return 'far-right';
  }

  // Check if card should be visible in carousel mode
  isCardVisible(index: number): boolean {
    const current = this.currentIndex();
    const diff = Math.abs(index - current);
    // Show center + 1 on each side = 3 cards max
    return diff <= 1;
  }

  // Navigation methods
  next(): void {
    if (this.canGoNext()) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prev(): void {
    if (this.canGoPrev()) {
      this.currentIndex.update(i => i - 1);
    }
  }

  goToIndex(index: number): void {
    if (index >= 0 && index < this.projects().length) {
      this.currentIndex.set(index);
    }
  }

  // Swipe handlers
  onSwipeLeft(): void {
    this.next();
  }

  onSwipeRight(): void {
    this.prev();
  }
}
