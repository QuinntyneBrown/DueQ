import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Tone } from '../models';

@Component({
  selector: 'lib-preview-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="preview-block" [class.dark]="dark()">
      <div>
        <div class="lbl">{{ label() }}</div>
        @if (sublabel()) {
          <div class="sub">{{ sublabel() }}</div>
        }
      </div>
      <div class="val" [class]="tone()">{{ amount() | currency }}</div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .preview-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--s-4);
      border-radius: var(--r-2);
      background: var(--surface-2);
      border: 1px dashed var(--border-strong);
      gap: var(--s-3);
    }
    .preview-block.dark {
      background: var(--ink);
      color: var(--bg);
      border: none;
    }
    .lbl { font-size: 13px; color: var(--ink-2); }
    .preview-block.dark .lbl { color: rgba(255,255,255,0.7); }
    .sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .preview-block.dark .sub { color: rgba(255,255,255,0.6); }
    .val {
      font-family: var(--font-num);
      font-weight: 600;
      font-size: 18px;
      letter-spacing: -0.01em;
    }
    .val.positive { color: var(--owed-to-you); }
    .val.negative { color: var(--owed-by-you); }
    .preview-block.dark .val { color: var(--bg); font-size: 22px; }
  `,
})
export class PreviewBlock {
  label = input.required<string>();
  sublabel = input<string | null>(null);
  amount = input.required<number>();
  tone = input<Tone>('default');
  dark = input<boolean>(false);
}
