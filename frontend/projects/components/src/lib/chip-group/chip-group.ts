import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-chip-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip-group.html',
  styleUrl: './chip-group.scss',
})
export class ChipGroup {
  ariaLabel = input<string | null>(null);
  role = input<string | null>('tablist');
  testId = input<string | null>(null);
}
