import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tone } from '../models';

@Component({
  selector: 'lib-key-value-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './key-value-row.html',
  styleUrl: './key-value-row.scss',
})
export class KeyValueRow {
  label = input.required<string>();
  value = input.required<string>();
  tone = input<Tone>('default');
}
