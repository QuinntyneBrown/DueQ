import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IconTile } from '../icon-tile/icon-tile';
import { Badge } from '../badge/badge';
import { BillListItemData } from '../models';

@Component({
  selector: 'lib-bill-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, IconTile, Badge],
  template: `
    <a class="row" (click)="onClick($event)">
      <lib-icon-tile [icon]="bill().icon" kind="bill"></lib-icon-tile>
      <div class="body">
        <div class="title">{{ bill().title }}</div>
        <div class="meta">{{ bill().date }} · <lib-badge [kind]="bill().status"></lib-badge></div>
      </div>
      <div class="right">
        <div class="amount">{{ bill().total | currency }}</div>
        <div class="sub">+{{ bill().partnerShare | currency }}</div>
      </div>
    </a>
  `,
  styles: `
    :host { display: block; }
    .row {
      display: flex;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-4);
      border-bottom: 1px solid var(--border);
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    :host(:last-child) .row { border-bottom: none; }
    .body { flex: 1; min-width: 0; }
    .title { font-weight: 600; font-size: 15px; letter-spacing: -0.01em; color: var(--ink); }
    .meta { font-size: 12px; color: var(--muted); margin-top: 2px; display: flex; align-items: center; gap: 6px; }
    .right { text-align: right; flex-shrink: 0; }
    .amount {
      font-family: var(--font-num);
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.01em;
      color: var(--ink);
    }
    .sub { font-size: 11px; color: var(--muted); margin-top: 2px; font-family: var(--font-num); }
  `,
})
export class BillListItem {
  bill = input.required<BillListItemData>();
  clicked = output<BillListItemData>();

  onClick(event: Event) {
    event.preventDefault();
    this.clicked.emit(this.bill());
  }
}
