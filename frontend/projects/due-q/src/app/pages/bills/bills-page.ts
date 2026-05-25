import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { BILLS_SERVICE, Bill, BillStatus, IBillsService } from 'api';
import {
  BillListItem,
  BillListItemData,
  BillMonthGroup,
  Chip,
  ChipGroup,
  PageHead,
} from 'components';

type Filter = 'All' | 'Unsettled' | 'Settled';

interface MonthGroup {
  readonly key: string;
  readonly label: string;
  readonly total: string;
  readonly bills: readonly DisplayBill[];
}

interface DisplayBill {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly dateLabel: string;
  readonly total: number;
  readonly totalLabel: string;
  readonly partnerShare: number;
  readonly partnerShareLabel: string;
  readonly status: BillStatus;
  readonly statusLabel: string;
}

@Component({
  selector: 'app-bills-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHead, ChipGroup, Chip, BillMonthGroup, BillListItem],
  templateUrl: './bills-page.html',
  styleUrl: './bills-page.scss',
})
export class BillsPage {
  private readonly billsService = inject<IBillsService>(BILLS_SERVICE);

  protected readonly filter = signal<Filter>('All');

  private readonly billsResource = resource<readonly Bill[], void>({
    loader: () => firstValueFrom(this.billsService.list()),
  });

  private readonly bills = computed(() => this.billsResource.value() ?? []);

  protected readonly counts = computed(() => {
    const bills = this.bills();
    const unsettled = bills.filter((b) => b.status === BillStatus.Unsettled).length;
    const settled = bills.filter((b) => b.status === BillStatus.Settled).length;
    return { all: bills.length, unsettled, settled };
  });

  protected readonly visibleBills = computed(() => {
    const all = this.bills();
    const f = this.filter();
    if (f === 'Unsettled') return all.filter((b) => b.status === BillStatus.Unsettled);
    if (f === 'Settled') return all.filter((b) => b.status === BillStatus.Settled);
    return all;
  });

  protected readonly months = computed<MonthGroup[]>(() =>
    groupBillsByMonth(this.visibleBills()),
  );

  protected readonly hasLoaded = computed(() => this.billsResource.value() !== undefined);
  protected readonly isEmpty = computed(() => this.hasLoaded() && this.bills().length === 0);

  protected select(filter: Filter): void {
    this.filter.set(filter);
  }

  protected isActive(filter: Filter): boolean {
    return this.filter() === filter;
  }
}

function groupBillsByMonth(bills: readonly Bill[]): MonthGroup[] {
  const datePipe = new DatePipe('en-US');
  const currency = new CurrencyPipe('en-US');
  const groups = new Map<string, Bill[]>();

  for (const bill of bills) {
    const d = new Date(`${bill.date}T00:00:00`);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(bill);
  }

  const sortedKeys = Array.from(groups.keys()).sort((a, b) => b.localeCompare(a));

  return sortedKeys.map((key) => {
    const monthBills = groups.get(key)!;
    const ref = new Date(`${monthBills[0].date}T00:00:00`);
    const label = datePipe.transform(ref, 'MMMM yyyy') ?? '';
    const unsettled = monthBills.filter((b) => b.status === BillStatus.Unsettled);
    const total = unsettled.length === 0
      ? 'All settled'
      : `+${currency.transform(
          unsettled.reduce((sum, b) => sum + b.partnerShare, 0),
          'USD',
          'symbol',
          '1.2-2',
        )} owed`;

    return {
      key,
      label,
      total,
      bills: monthBills.map((b) => ({
        id: b.id,
        title: b.description,
        icon: iconForBill(b.description),
        dateLabel: datePipe.transform(`${b.date}T00:00:00`, 'MMM d') ?? b.date,
        total: b.amount,
        totalLabel: currency.transform(b.amount, 'USD', 'symbol', '1.2-2') ?? `$${b.amount.toFixed(2)}`,
        partnerShare: b.partnerShare,
        partnerShareLabel: `+${currency.transform(b.partnerShare, 'USD', 'symbol', '1.2-2')}`,
        status: b.status,
        statusLabel: b.status === BillStatus.Settled ? 'Settled' : 'Unsettled',
      } satisfies BillListItemData)),
    };
  });
}

export function iconForBill(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('grocer') || t.includes('costco') || t.includes('loblaw')) return '🛒';
  if (t.includes('hydro') || t.includes('electric')) return '⚡';
  if (t.includes('internet') || t.includes('bell') || t.includes('rogers')) return '📱';
  if (t.includes('rent') || t.includes('mortgage')) return '🏠';
  if (
    t.includes('dinner') ||
    t.includes('lunch') ||
    t.includes('pizza') ||
    t.includes('restaurant') ||
    t.includes('bar ') ||
    t.includes('holiday')
  )
    return '🍕';
  return '🧾';
}
