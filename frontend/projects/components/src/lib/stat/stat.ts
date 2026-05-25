import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tone } from '../models';

@Component({
  selector: 'lib-stat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat.html',
  styleUrl: './stat.scss',
})
export class Stat {
  label = input.required<string>();
  value = input.required<string>();
  tone = input<Tone>('default');

  testId = computed(() => `stat-${this.label().toLowerCase().replace(/\s+/g, '-')}`);
}
