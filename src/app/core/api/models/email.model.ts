export type EmailTemplate = 'recruiter' | 'welcome';

export interface SendEmailPayload {
  to: string;
  subject?: string;
  template: EmailTemplate;
  context?: { name?: string };
}

export interface SendEmailResponse {
  message: string;
}
