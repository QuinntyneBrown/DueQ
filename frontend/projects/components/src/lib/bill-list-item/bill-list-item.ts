import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconTile } from '../icon-tile/icon-tile';
import { Badge } from '../badge/badge';
import { BillListItemData, LinkTarget, normalizeBillStatus } from '../models';

@Component({
  selector: 'lib-bill-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, NgTemplateOutlet, RouterLink, IconTile, Badge],
  templateUrl: './bill-list-item.html',
  styleUrl: './bill-list-item.scss',
})
export class BillListItem {
  bill = input.required<BillListItemData>();
  href = input<LinkTarget>(null);
  statusTestId = input<string | null>(null);
  clicked = output<BillListItemData>();

  linkTarget(): LinkTarget {
    return this.href() ?? this.bill().href ?? null;
  }

  statusKind() {
    return normalizeBillStatus(this.bill().status);
  }

  statusLabel(): string {
    return this.bill().statusLabel ?? this.statusKind().charAt(0).toUpperCase() + this.statusKind().slice(1);
  }

  onClick() {
    this.clicked.emit(this.bill());
  }
}
