import { Component, signal, inject, PLATFORM_ID, DestroyRef, OnInit } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.html',
  styleUrl: './preloader.scss',
})
export class Preloader implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  protected readonly visible = signal(true);
  protected readonly fadeOut = signal(false);
  private isInitialLoad = true;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.removeHtmlPreloader();
    this.dismissPreloader();
    this.listenToRouterEvents();
  }

  private removeHtmlPreloader(): void {
    const el = this.document.getElementById('initial-preloader');
    if (!el) return;

    el.classList.add('hiding');
    setTimeout(() => el.remove(), 600);
  }

  private dismissPreloader(): void {
    setTimeout(() => {
      this.fadeOut.set(true);
      setTimeout(() => {
        this.visible.set(false);
        this.isInitialLoad = false;
      }, 600);
    }, 300);
  }

  private listenToRouterEvents(): void {
    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(event => {
      if (this.isInitialLoad) return;

      if (event instanceof NavigationStart) {
        this.visible.set(true);
        this.fadeOut.set(false);
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.fadeOut.set(true);
          setTimeout(() => this.visible.set(false), 600);
        }, 200);
      }
    });
  }
}
