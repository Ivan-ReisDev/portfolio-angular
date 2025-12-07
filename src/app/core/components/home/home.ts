import { Component, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const section = this.elementRef.nativeElement.querySelector('#inicio');

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Adicionar classe reset primeiro para voltar ao estado inicial
              entry.target.classList.add('reset');
              entry.target.classList.remove('active');

              // Pequeno delay para permitir que o CSS processe o reset
              setTimeout(() => {
                entry.target.classList.remove('reset');
                entry.target.classList.add('active');
              }, 50);
            } else {
              // Quando sair do viewport, remover as classes
              entry.target.classList.remove('active');
              entry.target.classList.remove('reset');
            }
          });
        },
        {
          threshold: 0.3, // Ativa quando 30% da seção está visível
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
