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
    if (isPlatformBrowser(this.platformId)) {
      const section = this.elementRef.nativeElement.querySelector('#projetos');

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              this.isVisible.set(true);
            }
          });
        },
        {
          threshold: 0.1,
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
