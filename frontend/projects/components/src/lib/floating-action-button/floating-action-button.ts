import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-floating-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './floating-action-button.html',
  styleUrl: './floating-action-button.scss',
})
export class FloatingActionButton {
  icon = input<string>('＋');
  ariaLabel = input<string>('Add');
  clicked = output<void>();
}
