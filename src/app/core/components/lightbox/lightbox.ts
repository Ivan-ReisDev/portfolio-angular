import {
  Component,
  input,
  output,
  signal,
  computed,
  HostListener,
  PLATFORM_ID,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwipeDirective } from '../../directives/swipe.directive';

@Component({
  selector: 'app-lightbox',
  imports: [SwipeDirective],
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss'
})
export class Lightbox implements OnInit, OnDestroy {
  images = input.required<string[]>();
  initialIndex = input<number>(0);
  alt = input<string>('Imagem do projeto');

  closed = output<void>();

  private readonly platformId = inject(PLATFORM_ID);

  currentIndex = signal(0);

  readonly currentImage = computed(() => this.images()[this.currentIndex()]);
  readonly total = computed(() => this.images().length);
  readonly counter = computed(() => `${this.currentIndex() + 1} de ${this.total()}`);
  readonly hasPrev = computed(() => this.total() > 1);
  readonly hasNext = computed(() => this.total() > 1);

  ngOnInit(): void {
    this.currentIndex.set(this.initialIndex());
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    this.prev();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    this.next();
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      this.close();
    }
  }

  prev(): void {
    const total = this.total();
    if (total <= 1) return;
    const newIndex = this.currentIndex() === 0 ? total - 1 : this.currentIndex() - 1;
    this.currentIndex.set(newIndex);
  }

  next(): void {
    const total = this.total();
    if (total <= 1) return;
    const newIndex = this.currentIndex() === total - 1 ? 0 : this.currentIndex() + 1;
    this.currentIndex.set(newIndex);
  }
}
