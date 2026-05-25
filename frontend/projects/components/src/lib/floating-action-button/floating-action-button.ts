import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkTarget } from '../models';

@Component({
  selector: 'lib-floating-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './floating-action-button.html',
  styleUrl: './floating-action-button.scss',
})
export class FloatingActionButton {
  icon = input<string>('＋');
  ariaLabel = input<string>('Add');
  href = input<string | null>(null);
  routerLink = input<LinkTarget>(null);
  testId = input<string | null>(null);
  clicked = output<void>();
}
