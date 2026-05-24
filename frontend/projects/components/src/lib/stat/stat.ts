import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tone } from '../models';

@Component({
  selector: 'lib-stat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat">
      <div class="lbl">{{ label() }}</div>
      <div class="val" [class]="tone()">{{ value() }}</div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .stat {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-3);
      padding: var(--s-4);
    }
    .lbl {
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: var(--s-2);
    }
    .val {
      font-family: var(--font-num);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .val.positive { color: var(--owed-to-you); }
    .val.negative { color: var(--owed-by-you); }
    .val.muted { color: var(--muted); }
  `,
})
export class Stat {
  label = input.required<string>();
  value = input.required<string>();
  tone = input<Tone>('default');
}
