import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-bill-month-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bill-month-group.html',
  styleUrl: './bill-month-group.scss',
})
export class BillMonthGroup {
  month = input.required<string>();
  total = input<string | null>(null);
  ariaLabel = input<string | null>(null);
  totalTestId = input<string | null>(null);
}
