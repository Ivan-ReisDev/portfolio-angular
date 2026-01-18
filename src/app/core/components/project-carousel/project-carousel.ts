import {
  Component,
  inject,
  signal,
  computed
} from '@angular/core';
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

  // Navigation state - always enabled for infinite loop
  readonly canGoNext = computed(() => this.projects().length > 1);
  readonly canGoPrev = computed(() => this.projects().length > 1);

  // Whether to show carousel mode (desktop/tablet) or stacked mode (mobile)
  readonly isCarouselMode = computed(() =>
    this.viewportMode() !== 'mobile'
  );

  // Get position class for each card index relative to current (with infinite loop)
  getCardPosition(index: number): string {
    const current = this.currentIndex();
    const total = this.projects().length;

    if (total === 0) return 'far-left';

    // Calculate the shortest distance considering loop
    let diff = index - current;

    // Normalize for circular navigation
    if (diff > total / 2) {
      diff -= total;
    } else if (diff < -total / 2) {
      diff += total;
    }

    if (diff === 0) return 'center';
    if (diff === -1 || (current === 0 && index === total - 1)) return 'left';
    if (diff === 1 || (current === total - 1 && index === 0)) return 'right';
    if (diff < -1) return 'far-left';
    return 'far-right';
  }

  // Check if card should be visible in carousel mode (with infinite loop)
  isCardVisible(index: number): boolean {
    const current = this.currentIndex();
    const total = this.projects().length;

    if (total <= 3) return true; // Show all if 3 or fewer

    // Calculate circular distance
    let diff = Math.abs(index - current);

    // Consider the wrap-around distance
    const wrapDiff = total - diff;
    const minDiff = Math.min(diff, wrapDiff);

    // Show center + 1 on each side = 3 cards max
    return minDiff <= 1;
  }

  // Navigation methods (infinite loop)
  next(): void {
    if (this.canGoNext()) {
      const total = this.projects().length;
      this.currentIndex.update(i => (i + 1) % total);
    }
  }

  prev(): void {
    if (this.canGoPrev()) {
      const total = this.projects().length;
      this.currentIndex.update(i => (i - 1 + total) % total);
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
