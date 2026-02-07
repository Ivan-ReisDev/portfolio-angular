import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  readonly visible = input<boolean>(false);
  readonly title = input<string>('Confirmar ação');
  readonly message = input<string>('Tem certeza que deseja continuar?');
  readonly confirmLabel = input<string>('Confirmar');
  readonly cancelLabel = input<string>('Cancelar');
  readonly destructive = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('confirm-overlay')) {
      this.cancel.emit();
    }
  }
}
