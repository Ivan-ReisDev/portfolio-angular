import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Carousel } from '../carousel/carousel';
import { Title } from "../typography/title/title";

@Component({
  selector: 'app-projects',
  imports: [Carousel, Title],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private elementRef: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const section = this.elementRef.nativeElement.querySelector('#projetos');

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
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
