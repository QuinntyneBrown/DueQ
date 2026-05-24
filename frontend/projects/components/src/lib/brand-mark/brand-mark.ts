import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-mark.html',
  styleUrl: './brand-mark.scss',
})
export class BrandMark {
  letter = input<string>('D');
  label = input<string | null>(null);
}
