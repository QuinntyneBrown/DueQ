import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-balance-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <section class="balance-card">
      <div class="label">{{ label() }}</div>
      <div class="amount">{{ amount() | currency }}</div>
      @if (meta()) {
        <div class="meta">{{ meta() }}</div>
      }
      <div class="actions">
        <button type="button" class="btn btn-secondary" (click)="addBill.emit()">＋ Add bill</button>
        <button type="button" class="btn btn-secondary" (click)="recordPayment.emit()">↓ Record payment</button>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .balance-card {
      background: var(--ink);
      color: var(--bg);
      border-radius: var(--r-4);
      padding: var(--s-6) var(--s-5);
      position: relative;
      overflow: hidden;
    }
    .balance-card::after {
      content: "";
      position: absolute;
      right: -40px;
      top: -40px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(180, 83, 9, 0.35) 0%, transparent 70%);
    }
    .label {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      opacity: 0.7;
      margin-bottom: var(--s-3);
    }
    .amount {
      font-family: var(--font-num);
      font-size: 44px;
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: var(--s-2);
    }
    .meta {
      font-size: 13px;
      opacity: 0.75;
      margin-bottom: var(--s-5);
    }
    .actions {
      display: flex;
      gap: var(--s-2);
      position: relative;
      z-index: 1;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--s-2);
      height: 44px;
      padding: 0 var(--s-4);
      border-radius: var(--r-2);
      font-size: 14px;
      font-weight: 600;
      border: 1px solid transparent;
      cursor: pointer;
      font-family: inherit;
      background: rgba(255,255,255,0.08);
      color: var(--bg);
      border-color: rgba(255,255,255,0.15);
    }
    @media (min-width: 768px) {
      .amount { font-size: 56px; }
    }
  `,
})
export class BalanceCard {
  label = input<string>('Sam owes you');
  amount = input.required<number>();
  meta = input<string | null>(null);
  addBill = output<void>();
  recordPayment = output<void>();
}
