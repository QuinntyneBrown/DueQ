import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  BillListItem,
  BillMonthGroup,
  Chip,
  ChipGroup,
  PageHead,
} from 'components';
import type { BillListItemData } from 'components';
import { BILLS_SERVICE, BillStatus, type Bill } from 'api';
import { billToListItem, monthLabel, formatCurrency } from '../utils/mappers';

type Filter = 'all' | 'unsettled' | 'settled';

interface MonthGroup {
  readonly key: string;
  readonly label: string;
  readonly totalLabel: string;
  readonly items: readonly BillListItemData[];
}

@Component({
  selector: 'lib-bills-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BillListItem, BillMonthGroup, Chip, ChipGroup, PageHead],
  templateUrl: './bills-page.html',
  styleUrl: './bills-page.scss',
})
export class BillsPage {
  private readonly billsService = inject(BILLS_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly bills = toSignal(this.billsService.list(), { initialValue: [] as readonly Bill[] });

  readonly filter = toSignal(
    this.route.queryParamMap.pipe(map((p) => (p.get('status') as Filter | null) ?? 'all')),
    { initialValue: 'all' as Filter },
  );

  readonly counts = computed(() => {
    const all = this.bills();
    return {
      all: all.length,
      unsettled: all.filter((b) => b.status === BillStatus.Unsettled).length,
      settled: all.filter((b) => b.status === BillStatus.Settled).length,
    };
  });

  readonly filtered = computed(() => {
    const f = this.filter();
    const all = this.bills();
    if (f === 'unsettled') return all.filter((b) => b.status === BillStatus.Unsettled);
    if (f === 'settled') return all.filter((b) => b.status === BillStatus.Settled);
    return all;
  });

  readonly groups = computed<readonly MonthGroup[]>(() => {
    const buckets = new Map<string, { year: number; month: number; bills: Bill[] }>();
    for (const bill of this.filtered()) {
      const d = new Date(bill.date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      const bucket = buckets.get(key) ?? { year, month, bills: [] };
      bucket.bills.push(bill);
      buckets.set(key, bucket);
    }
    return [...buckets.entries()]
      .sort(([a], [b]) => (a > b ? -1 : 1))
      .map(([key, b]) => {
        const owed = b.bills
          .filter((x) => x.status === BillStatus.Unsettled)
          .reduce((sum, x) => sum + x.partnerShare, 0);
        const totalLabel = owed > 0 ? `+${formatCurrency(owed)} owed` : 'All settled';
        return {
          key,
          label: monthLabel(b.year, b.month),
          totalLabel,
          items: b.bills.map(billToListItem),
        };
      });
  });

  setFilter(f: Filter) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: f === 'all' ? null : f },
      queryParamsHandling: 'merge',
    });
  }

  openBill(bill: BillListItemData) {
    this.router.navigateByUrl(`/bills/${bill.id}`);
  }
}
