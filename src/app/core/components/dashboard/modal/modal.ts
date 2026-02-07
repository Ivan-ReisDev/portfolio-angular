import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal {
  readonly title = input<string>('');
  readonly visible = input<boolean>(false);
  readonly close = output<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
