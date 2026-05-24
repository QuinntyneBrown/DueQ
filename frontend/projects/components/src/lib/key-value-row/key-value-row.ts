import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tone } from '../models';

@Component({
  selector: 'lib-key-value-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kv">
      <span class="k">{{ label() }}</span>
      <span class="v" [class]="tone()">{{ value() }}</span>
    </div>
  `,
  styles: `
    :host { display: block; }
    .kv {
      display: flex;
      justify-content: space-between;
      padding: var(--s-3) 0;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }
    :host(:last-of-type) .kv { border-bottom: none; }
    .k { color: var(--muted); }
    .v { color: var(--ink); font-weight: 500; }
    .v.positive { color: var(--owed-to-you); }
    .v.negative { color: var(--owed-by-you); }
    .v.muted { color: var(--muted); }
  `,
})
export class KeyValueRow {
  label = input.required<string>();
  value = input.required<string>();
  tone = input<Tone>('default');
}
