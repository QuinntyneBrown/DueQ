import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
})
export class Chip {
  label = input.required<string>();
  count = input<number | null>(null);
  active = input<boolean>(false);
  disabled = input<boolean>(false);
  role = input<string | null>('tab');
  ariaSelected = input<boolean | null>(null);
  testId = input<string | null>(null);
  countTestId = input<string | null>(null);
  toggle = output<void>();
}
