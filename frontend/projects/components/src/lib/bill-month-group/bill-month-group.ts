import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-bill-month-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section">
      <div class="section-head">
        <h2>{{ month() }}</h2>
        @if (total()) {
          <span class="total">{{ total() }}</span>
        }
      </div>
      <div class="card">
        <div class="list">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .section { margin-top: var(--s-6); }
    :host(:first-of-type) .section { margin-top: 0; }
    .section-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: var(--s-3);
    }
    h2 {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--muted);
      margin: 0;
    }
    .total {
      font-size: 12px;
      color: var(--muted);
      font-family: var(--font-num);
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-3);
    }
    .list { display: flex; flex-direction: column; }
  `,
})
export class BillMonthGroup {
  month = input.required<string>();
  total = input<string | null>(null);
}
