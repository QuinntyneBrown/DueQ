import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IconTile } from '../icon-tile/icon-tile';
import { Badge } from '../badge/badge';
import { BillListItemData } from '../models';

@Component({
  selector: 'lib-bill-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, IconTile, Badge],
  templateUrl: './bill-list-item.html',
  styleUrl: './bill-list-item.scss',
})
export class BillListItem {
  bill = input.required<BillListItemData>();
  clicked = output<BillListItemData>();

  onClick(event: Event) {
    event.preventDefault();
    this.clicked.emit(this.bill());
  }
}
