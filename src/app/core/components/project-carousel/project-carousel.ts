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
  imports: [ProjectCard, SwipeDirective],
  templateUrl: './project-carousel.html',
  styleUrl: './project-carousel.scss'
})
export class ProjectCarousel {
  private readonly projectService = inject(ProjectService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly projects = this.projectService.projects;
  readonly loading = this.projectService.loading;

  readonly currentIndex = signal(0);
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

  readonly canGoNext = computed(() => this.projects().length > 1);
  readonly canGoPrev = computed(() => this.projects().length > 1);
  readonly isCarouselMode = computed(() =>
    this.viewportMode() !== 'mobile'
  );
  getCardPosition(index: number): string {
    const current = this.currentIndex();
    const total = this.projects().length;

    if (total === 0) return 'far-left';

    let diff = index - current;
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

  isCardVisible(index: number): boolean {
    const current = this.currentIndex();
    const total = this.projects().length;

    if (total <= 3) return true;

    let diff = Math.abs(index - current);

    const wrapDiff = total - diff;
    const minDiff = Math.min(diff, wrapDiff);
    return minDiff <= 1;
  }

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

  onSwipeLeft(): void {
    this.next();
  }

  onSwipeRight(): void {
    this.prev();
  }
}
