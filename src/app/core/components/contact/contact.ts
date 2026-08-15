import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  signal,
  inject,
  PLATFORM_ID,
  DestroyRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

import { Title } from '../typography/title/title';
import { PhoneMaskDirective } from '../../directives/phone-mask.directive';
import { ContactApiService } from '../../api/services/contact-api.service';

@Component({
  selector: 'app-contact',
  imports: [Title, ReactiveFormsModule, PhoneMaskDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements AfterViewInit, OnDestroy {
  @ViewChild('contactSection', { static: true }) contactSection!: ElementRef<HTMLElement>;
  @ViewChild('phrase') phrase!: ElementRef;
  @ViewChild('formElement') formElement!: ElementRef;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  private readonly contactApi = inject(ContactApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal<string | null>(null);

  private entranceObserver: IntersectionObserver | null = null;

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.minLength(10), Validators.maxLength(11)]],
    description: ['', [Validators.required]]
  });

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.entranceObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.phrase.nativeElement.classList.add('visible');
              this.formElement.nativeElement.classList.add('visible');
              this.entranceObserver?.disconnect();
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -8% 0px'
        }
      );

      this.entranceObserver.observe(this.contactSection.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.entranceObserver?.disconnect();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(false);

    const { name, email, phone, description } = this.contactForm.getRawValue();

    this.contactApi
      .create({
        name,
        email,
        description,
        ...(phone ? { phone } : {})
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.submitSuccess.set(true);
          this.contactForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.submitError.set(this.parseErrorMessage(error));
        }
      });
  }

  dismissSuccess(): void {
    this.submitSuccess.set(false);
  }

  dismissError(): void {
    this.submitError.set(null);
  }

  private parseErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Sem conexão com o servidor. Tente novamente mais tarde.';
    }

    const body = error.error;

    if (body?.message) {
      return Array.isArray(body.message) ? body.message.join(', ') : body.message;
    }

    return 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.';
  }
}
