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
  toggle = output<void>();
}
