import {
  Component,
  inject,
  signal,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxParticlesModule } from '@tsparticles/angular';
import { Engine, IOptions, RecursivePartial } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

import { AuthService } from '../../core/api/services/auth.service';

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded: () => void;
  }
}

const TURNSTILE_SITE_KEY = '0x4AAAAAACY37U40bZy-BusW';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgxParticlesModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  @ViewChild('turnstileContainer') turnstileContainer!: ElementRef<HTMLDivElement>;

  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly turnstileToken = signal<string | null>(null);
  readonly turnstileAvailable = signal(false);

  private widgetId: string | null = null;

  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }

  particlesOptions: RecursivePartial<IOptions> = {
    fpsLimit: 120,
    fullScreen: { enable: true, zIndex: 1 },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: true, mode: 'repulse' },
        resize: { enable: true }
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    particles: {
      color: { value: '#ffffff' },
      links: { enable: false },
      move: {
        direction: 'none',
        enable: true,
        outModes: 'out',
        random: true,
        speed: 0.6,
        straight: false
      },
      number: { density: { enable: true, width: 800 }, value: 40 },
      opacity: { value: 0.4 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } }
    },
    detectRetina: true,
    style: {
      pointerEvents: 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%'
    }
  };

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly showPassword = signal(false);

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.loadTurnstileScript();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    if (this.widgetId && window.turnstile) {
      window.turnstile.remove(this.widgetId);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.turnstileAvailable() && !this.turnstileToken()) {
      this.errorMessage.set('Complete a verificação de segurança.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();
    const turnstileToken = this.turnstileToken() ?? undefined;

    this.authService
      .login({ email, password, turnstileToken })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          const redirectPath = this.authService.isAdmin() ? '/dashboard' : '/dashboard/tickets';
          this.router.navigate([redirectPath]);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(this.parseError(error));
          this.resetTurnstile();
        }
      });
  }

  private loadTurnstileScript(): void {
    if (window.turnstile) {
      this.renderWidget();
      return;
    }

    window.onTurnstileLoaded = () => {
      this.ngZone.run(() => this.renderWidget());
    };

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoaded';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      this.ngZone.run(() => this.turnstileAvailable.set(false));
    };
    document.head.appendChild(script);
  }

  private renderWidget(): void {
    if (!this.turnstileContainer?.nativeElement || !window.turnstile) return;

    this.turnstileAvailable.set(true);
    this.widgetId = window.turnstile.render(this.turnstileContainer.nativeElement, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'dark',
      callback: (token: string) => {
        this.ngZone.run(() => this.turnstileToken.set(token));
      },
      'expired-callback': () => {
        this.ngZone.run(() => this.turnstileToken.set(null));
      },
      'error-callback': () => {
        this.ngZone.run(() => {
          this.turnstileAvailable.set(false);
          this.turnstileToken.set(null);
        });
      }
    });
  }

  private resetTurnstile(): void {
    this.turnstileToken.set(null);
    if (this.widgetId && window.turnstile) {
      window.turnstile.reset(this.widgetId);
    }
  }

  private parseError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Sem conexão com o servidor. Tente novamente mais tarde.';
    }
    if (error.status === 401) {
      return 'Email ou senha incorretos.';
    }
    const body = error.error;
    if (body?.message) {
      return Array.isArray(body.message) ? body.message.join(', ') : body.message;
    }
    return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}
