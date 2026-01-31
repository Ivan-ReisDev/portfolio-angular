import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective implements OnInit, OnDestroy {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);

  private startX = 0;
  private startY = 0;
  private startTime = 0;

  private boundPointerDown = this.onPointerDown.bind(this);
  private boundPointerUp = this.onPointerUp.bind(this);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.el.nativeElement as HTMLElement;
    el.addEventListener('pointerdown', this.boundPointerDown);
    el.addEventListener('pointerup', this.boundPointerUp);
    el.addEventListener('pointercancel', this.boundPointerUp);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.el.nativeElement as HTMLElement;
    el.removeEventListener('pointerdown', this.boundPointerDown);
    el.removeEventListener('pointerup', this.boundPointerUp);
    el.removeEventListener('pointercancel', this.boundPointerUp);
  }

  private onPointerDown(e: PointerEvent): void {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
  }

  private onPointerUp(e: PointerEvent): void {
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    const duration = Date.now() - this.startTime;

    const minSwipeDistance = 50;
    const maxSwipeTime = 500;

    if (
      duration < maxSwipeTime &&
      Math.abs(deltaX) > minSwipeDistance &&
      Math.abs(deltaX) > Math.abs(deltaY) * 2
    ) {
      if (deltaX > 0) {
        this.swipeRight.emit();
      } else {
        this.swipeLeft.emit();
      }
    }
  }
}
