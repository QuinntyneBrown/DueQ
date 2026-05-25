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
import {
  ActivityKind,
  HISTORY_SERVICE,
  History,
  HistoryEntry,
  IHistoryService,
  ISettingsService,
  SETTINGS_SERVICE,
} from 'api';
import { PageHead } from 'components';
import { iconForBill } from '../bills/bills-page';

type Filter = 'All' | 'Bills only' | 'Payments only';

interface DisplayEntry {
  readonly id: string;
  readonly icon: string;
  readonly iconKind: 'bill' | 'payment';
  readonly title: string;
  readonly meta: string;
  readonly deltaText: string;
  readonly isPayment: boolean;
  readonly runningBalanceText: string;
}

interface MonthSection {
  readonly key: string;
  readonly label: string;
  readonly monthTotalText: string;
  readonly entries: readonly DisplayEntry[];
}

@Component({
  selector: 'app-history-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHead],
  templateUrl: './history-page.html',
  styleUrl: './history-page.scss',
})
export class HistoryPage {
  private readonly historyService = inject<IHistoryService>(HISTORY_SERVICE);
  private readonly settingsService = inject<ISettingsService>(SETTINGS_SERVICE);

  protected readonly filter = signal<Filter>('All');
  protected readonly filters: Filter[] = ['All', 'Bills only', 'Payments only'];

  protected readonly history = resource<History, void>({
    loader: () => firstValueFrom(this.historyService.get()),
  });

  private readonly settings = resource({
    loader: () => firstValueFrom(this.settingsService.get()),
  });

  protected readonly partnerName = computed(
    () => this.settings.value()?.partnerName ?? 'Partner',
  );

  protected readonly runningBalance = computed(() =>
    formatCurrency(Math.max(0, this.history.value()?.runningBalance ?? 0)),
  );
  protected readonly totalLogged = computed(() =>
    formatCurrency(this.history.value()?.totalLogged ?? 0),
  );
  protected readonly totalPaidBack = computed(() =>
    formatCurrency(this.history.value()?.totalReceived ?? 0),
  );

  protected readonly months = computed<MonthSection[]>(() => {
    const data = this.history.value();
    if (!data) return [];
    const f = this.filter();
    const partner = this.partnerName();
    return data.months
      .map((month): MonthSection => {
        const entries = month.entries
          .filter((e) => filterEntry(e, f))
          .map((e) => toDisplayEntry(e, partner));
        const label = monthLabel(month.year, month.month);
        return {
          key: `${month.year}-${month.month}`,
          label,
          monthTotalText: formatSignedCurrency(month.monthDelta),
          entries,
        };
      })
      .filter((m) => m.entries.length > 0);
  });

  protected select(filter: Filter): void {
    this.filter.set(filter);
  }
  protected isActive(filter: Filter): boolean {
    return this.filter() === filter;
  }
}

function filterEntry(e: HistoryEntry, f: Filter): boolean {
  if (f === 'All') return true;
  if (f === 'Bills only') return e.kind === ActivityKind.Bill;
  return e.kind === ActivityKind.Payment;
}

function toDisplayEntry(e: HistoryEntry, partnerName: string): DisplayEntry {
  const isPayment = e.kind === ActivityKind.Payment;
  const date = e.date.length === 10 ? `${e.date}T00:00:00` : e.date;
  const dateLabel = new DatePipe('en-US').transform(date, 'MMM d') ?? e.date;
  const amountLabel = formatCurrency(e.amount);
  return {
    id: e.id,
    icon: isPayment ? '↓' : iconForBill(e.title),
    iconKind: isPayment ? 'payment' : 'bill',
    title: isPayment ? `Payment from ${partnerName}` : e.title,
    meta: `${dateLabel} · ${amountLabel}`,
    deltaText: isPayment ? `−${formatCurrency(Math.abs(e.balanceDelta))}` : `+${formatCurrency(e.balanceDelta)}`,
    isPayment,
    runningBalanceText: `balance ${formatSignedCurrency(e.runningBalance)}`,
  };
}

function monthLabel(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  return new DatePipe('en-US').transform(d, 'MMMM yyyy') ?? `${year}-${month}`;
}

function formatCurrency(value: number): string {
  return new CurrencyPipe('en-US').transform(value, 'USD', 'symbol', '1.2-2') ?? `$${value.toFixed(2)}`;
}

function formatSignedCurrency(value: number): string {
  if (value < 0) return `-${formatCurrency(Math.abs(value))}`;
  return `+${formatCurrency(value)}`;
}
