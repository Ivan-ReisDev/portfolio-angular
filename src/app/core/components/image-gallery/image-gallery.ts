import { Component, input, signal, computed } from '@angular/core';
import { Lightbox } from '../lightbox/lightbox';

@Component({
  selector: 'app-image-gallery',
  imports: [Lightbox],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.scss'
})
export class ImageGallery {
  images = input.required<string[]>();
  alt = input<string>('Imagem do projeto');

  currentIndex = signal(0);
  lightboxOpen = signal(false);

  readonly currentImage = computed(() => this.images()[this.currentIndex()]);
  readonly hasMultipleImages = computed(() => this.images().length > 1);

  selectImage(index: number): void {
    this.currentIndex.set(index);
  }

  openLightbox(): void {
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }
}
