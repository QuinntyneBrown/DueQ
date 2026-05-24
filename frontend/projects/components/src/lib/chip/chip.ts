import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="chip" [class.is-active]="active()" (click)="toggle.emit()">
      {{ label() }}
      @if (count() !== null) {
        <span class="count">{{ count() }}</span>
      }
    </button>
  `,
  styles: `
    :host { display: inline-block; flex-shrink: 0; }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: var(--r-pill);
      border: 1px solid var(--border);
      background: var(--surface);
      font-size: 13px;
      font-weight: 500;
      color: var(--ink-2);
      white-space: nowrap;
      cursor: pointer;
      font-family: inherit;
    }
    .chip.is-active {
      background: var(--ink);
      color: var(--bg);
      border-color: var(--ink);
    }
    .count {
      font-size: 11px;
      color: var(--muted);
      background: var(--surface-2);
      padding: 1px 6px;
      border-radius: var(--r-pill);
    }
    .chip.is-active .count { background: rgba(255,255,255,0.15); color: var(--bg); }
  `,
})
export class Chip {
  label = input.required<string>();
  count = input<number | null>(null);
  active = input<boolean>(false);
  toggle = output<void>();
}
