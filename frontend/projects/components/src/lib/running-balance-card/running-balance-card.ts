import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-running-balance-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="card">
      <div class="row">
        <div class="primary">
          <div class="caption">Running balance</div>
          <div class="value">{{ balance() | currency }}</div>
          <div class="sub">{{ partnerName() }} owes you</div>
        </div>
        <div class="secondary">
          <div>
            <div class="caption">Logged</div>
            <div class="num">{{ logged() | currency }}</div>
          </div>
          <div>
            <div class="caption">Paid back</div>
            <div class="num positive">{{ paidBack() | currency }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-3);
      padding: var(--s-5);
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: var(--s-3);
    }
    .caption {
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .value {
      font-family: var(--font-num);
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-top: 4px;
    }
    .sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .secondary { display: flex; gap: var(--s-5); }
    .num {
      font-family: var(--font-num);
      font-weight: 600;
      margin-top: 2px;
    }
    .num.positive { color: var(--owed-to-you); }
  `,
})
export class RunningBalanceCard {
  balance = input.required<number>();
  logged = input.required<number>();
  paidBack = input.required<number>();
  partnerName = input<string>('Sam');
}
