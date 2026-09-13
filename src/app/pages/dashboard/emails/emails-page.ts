import { Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
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
    const values = this.form.getRawValue();
    const payload = this.createPayload(values);
    this.sending.set(true);
    this.emailApi
      .send(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.sending.set(false)))
      .subscribe({
        next: () => this.handleSendSuccess(values.to!, payload.template),
        error: (error: unknown) => this.handleSendError(error)
      });
  }

  private createPayload(values: { to: string | null; contactName: string | null; subject: string | null }): SendEmailPayload {
    const payload: SendEmailPayload = { to: values.to!, template: this.selectedTemplate() };
    if (values.subject?.trim()) payload.subject = values.subject.trim();
    if (values.contactName?.trim()) payload.context = { name: values.contactName.trim() };
    return payload;
  }

  private handleSendSuccess(to: string, template: EmailTemplate): void {
    this.toast.success(`E-mail enviado para ${to}`);
    this.sentEmails.update((list) => [{ to, template, sentAt: new Date() }, ...list]);
    this.form.reset();
  }

  private handleSendError(error: unknown): void {
    const body = error as { error?: { message?: unknown } };
    const message = body.error?.message;
    this.toast.error(Array.isArray(message) ? String(message[0]) : typeof message === 'string' ? message : 'Falha ao enviar e-mail');
  }
}
