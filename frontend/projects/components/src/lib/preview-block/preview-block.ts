import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Tone } from '../models';

@Component({
  selector: 'lib-preview-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './preview-block.html',
  styleUrl: './preview-block.scss',
})
export class PreviewBlock {
  label = input.required<string>();
  sublabel = input<string | null>(null);
  amount = input.required<number>();
  tone = input<Tone>('default');
  dark = input<boolean>(false);
}
