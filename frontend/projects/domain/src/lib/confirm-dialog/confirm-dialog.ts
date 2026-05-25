import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'components';

@Component({
  selector: 'lib-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  host: {
    role: 'dialog',
    '[attr.aria-modal]': '"true"',
    '[attr.aria-labelledby]': 'titleId',
  },
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input<string | null>(null);
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');
  readonly dangerous = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly titleId = `confirm-dialog-title-${Math.random().toString(36).slice(2, 9)}`;
}
