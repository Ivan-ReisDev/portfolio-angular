import { Component, Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  show(type: ToastType, message: string, duration = 4000): void {
    const id = ++this.counter;
    this.toasts.update((current) => [...current, { id, type, message }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message, 6000);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
  readonly toastService: ToastService;

  constructor(toastService: ToastService) {
    this.toastService = toastService;
  }

  getIcon(type: ToastType): string {
    const icons: Record<ToastType, string> = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-xmark',
      info: 'fa-solid fa-circle-info'
    };
    return icons[type];
  }
}
