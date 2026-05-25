import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  ActivityKind,
  DASHBOARD_SERVICE,
  Dashboard,
  IDashboardService,
} from 'api';
import {
  ActivityList,
  ActivityItem as ComponentActivityItem,
  BalanceCard,
  PageHead,
  SectionHead,
  Stat,
  StatRow,
} from 'components';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    PageHead,
    BalanceCard,
    StatRow,
    Stat,
    SectionHead,
    ActivityList,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private readonly dashboardService = inject<IDashboardService>(DASHBOARD_SERVICE);

  protected readonly timeOfDay = computeTimeOfDay(new Date().getHours());

  protected readonly resource = resource<Dashboard, void>({
    loader: () => firstValueFrom(this.dashboardService.get()),
  });

  protected readonly data = computed(() => this.resource.value());

  protected readonly greeting = computed(() => {
    const data = this.data();
    const first = (data?.yourName ?? '').split(/\s+/)[0];
    return first ? `Good ${this.timeOfDay}, ${first}` : `Good ${this.timeOfDay}`;
  });

  protected readonly subtitle = computed(() => {
    const data = this.data();
    return data?.partnerName ? `Here's where things stand with ${data.partnerName}.` : null;
  });

  protected readonly balanceLabel = computed(() => {
    const data = this.data();
    if (!data) return 'Balance';
    if (data.balance === 0) return 'All settled';
    if (data.balance > 0) return `${data.partnerName} owes you`;
    return `You owe ${data.partnerName}`;
  });

  protected readonly balanceAmount = computed(() => Math.abs(this.data()?.balance ?? 0));

  protected readonly behindByTone = computed(() =>
    (this.data()?.behindByDays ?? 0) > 7 ? 'negative' : 'default',
  );

  protected readonly activityItems = computed<ComponentActivityItem[]>(() => {
    const data = this.data();
    if (!data) return [];
    return data.recentActivity.map((a) => {
      const isPayment = a.kind === ActivityKind.Payment;
      return {
        id: a.id,
        kind: isPayment ? 'payment' : 'bill',
        icon: isPayment ? '↓' : iconForBill(a.title),
        title: isPayment ? `Payment from ${data.partnerName}` : a.title,
        meta: formatMeta(a.date, a.amount),
        amount: a.balanceDelta,
        sub: isPayment ? 'Received' : `${data.partnerName}'s share`,
        href: isPayment ? '/history' : `/bills/${a.id}`,
      };
    });
  });

  private readonly datePipe = new DatePipe('en-US');
  private readonly currencyPipe = new CurrencyPipe('en-US');

  protected balanceMeta = computed(() => {
    const data = this.data();
    if (!data) return null;
    const settled = data.lastSettlementDate
      ? `Last settled ${this.datePipe.transform(data.lastSettlementDate, 'MMM d')}`
      : 'No payments yet';
    const outstanding = `${data.outstandingBillCount} bill${data.outstandingBillCount === 1 ? '' : 's'} outstanding`;
    return `${settled} · ${outstanding}`;
  });

  protected behindByValue = computed(() => {
    const days = this.data()?.behindByDays ?? 0;
    return `${days} day${days === 1 ? '' : 's'}`;
  });

  protected formatStatCurrency(value: number | undefined): string {
    return this.currencyPipe.transform(value ?? 0, 'USD', 'symbol', '1.2-2') ?? '$0.00';
  }
}

export function computeTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function formatMeta(date: string, amount: number): string {
  const datePipe = new DatePipe('en-US');
  const currencyPipe = new CurrencyPipe('en-US');
  const d = datePipe.transform(date, 'MMM d') ?? date;
  const a = currencyPipe.transform(amount, 'USD', 'symbol', '1.2-2') ?? `$${amount.toFixed(2)}`;
  return `${d} · ${a}`;
}

function iconForBill(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('grocer') || t.includes('costco') || t.includes('loblaw')) return '🛒';
  if (t.includes('hydro') || t.includes('electric')) return '⚡';
  if (t.includes('internet') || t.includes('bell') || t.includes('rogers')) return '📱';
  if (t.includes('rent') || t.includes('mortgage')) return '🏠';
  if (t.includes('dinner') || t.includes('lunch') || t.includes('pizza') || t.includes('restaurant')) return '🍕';
  return '🧾';
}
