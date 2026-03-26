import { Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { EmailApiService } from '../../../core/api/services/email-api.service';
import { ToastService } from '../../../core/components/dashboard/toast/toast';
import { EmailTemplate, SendEmailPayload } from '../../../core/api/models/email.model';

interface SentEmail {
  to: string;
  template: EmailTemplate;
  sentAt: Date;
}

@Component({
  selector: 'app-emails-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './emails-page.html',
  styleUrl: './emails-page.scss'
})
export class EmailsPage {
  private readonly emailApi = inject(EmailApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly sending = signal(false);
  readonly selectedTemplate = signal<EmailTemplate>('recruiter');
  readonly sentEmails = signal<SentEmail[]>([]);

  readonly form = this.fb.group({
    to: ['', [Validators.required, Validators.email]],
    contactName: [''],
    subject: ['']
  });

  readonly templates: { value: EmailTemplate; label: string; description: string; icon: string }[] = [
    {
      value: 'recruiter',
      label: 'Recrutador',
      description: 'E-mail profissional para recrutadores com currículo',
      icon: 'fa-solid fa-briefcase'
    },
    {
      value: 'welcome',
      label: 'Boas-vindas',
      description: 'E-mail de boas-vindas para novos contatos',
      icon: 'fa-solid fa-hand-wave'
    }
  ];

  selectTemplate(template: EmailTemplate): void {
    this.selectedTemplate.set(template);
  }

  sendEmail(): void {
    if (this.form.invalid || this.sending()) return;

    this.sending.set(true);
    const { to, contactName, subject } = this.form.getRawValue();

    const payload: SendEmailPayload = {
      to: to!,
      template: this.selectedTemplate()
    };

    if (subject?.trim()) payload.subject = subject.trim();
    if (contactName?.trim()) payload.context = { name: contactName.trim() };

    this.emailApi
      .send(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success(`E-mail enviado para ${to}`);
          this.sentEmails.update(list => [
            { to: to!, template: this.selectedTemplate(), sentAt: new Date() },
            ...list
          ]);
          this.form.reset();
        },
        error: (err) => {
          const message = err?.error?.message ?? 'Falha ao enviar e-mail';
          this.toast.error(Array.isArray(message) ? message[0] : message);
        },
        complete: () => this.sending.set(false)
      });
  }
}
