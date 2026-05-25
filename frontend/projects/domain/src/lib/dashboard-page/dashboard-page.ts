import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  ActivityList,
  BalanceCard,
  PageHead,
  SectionHead,
  Stat,
  StatRow,
} from 'components';
import { DASHBOARD_SERVICE } from 'api';
import type { ActivityItem as PresActivityItem } from 'components';
import { apiActivityToPres, formatCurrency, formatShortDate } from '../utils/mappers';

const GREETING_HOURS: Array<{ until: number; word: string }> = [
  { until: 12, word: 'morning' },
  { until: 18, word: 'afternoon' },
  { until: 24, word: 'evening' },
];

@Component({
  selector: 'lib-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityList, BalanceCard, PageHead, SectionHead, Stat, StatRow],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private readonly dashboardService = inject(DASHBOARD_SERVICE);
  private readonly router = inject(Router);

  private readonly data = toSignal(this.dashboardService.get(), { initialValue: null });

  readonly greeting = computed(() => {
    const data = this.data();
    const word = GREETING_HOURS.find((g) => new Date().getHours() < g.until)?.word ?? 'evening';
    const name = data?.yourName?.split(/\s+/)[0] ?? '';
    return name ? `Good ${word}, ${name}` : `Good ${word}`;
  });

  readonly subtitle = computed(() => {
    const partner = this.data()?.partnerName;
    return partner ? `Here's where things stand with ${partner}.` : null;
  });

  readonly balanceLabel = computed(() => {
    const data = this.data();
    if (!data) return 'Outstanding';
    if (data.balance === 0) return 'All settled';
    if (data.balance > 0) return `${data.partnerName} owes you`;
    return `You owe ${data.partnerName}`;
  });

  readonly balance = computed(() => Math.abs(this.data()?.balance ?? 0));

  readonly balanceMeta = computed(() => {
    const data = this.data();
    if (!data) return null;
    const last = data.lastSettlementDate
      ? `Last settled ${formatShortDate(data.lastSettlementDate)}`
      : 'No settlements yet';
    return `${last} · ${data.outstandingBillCount} bill${data.outstandingBillCount === 1 ? '' : 's'} outstanding`;
  });

  readonly thisMonth = computed(() => formatCurrency(this.data()?.thisMonthLogged ?? 0));
  readonly received = computed(() => formatCurrency(this.data()?.thisMonthReceived ?? 0));
  readonly behindBy = computed(() => `${this.data()?.behindByDays ?? 0} days`);
  readonly behindTone = computed(() =>
    (this.data()?.behindByDays ?? 0) > 0 ? ('negative' as const) : ('default' as const),
  );

  readonly activity = computed<PresActivityItem[]>(() =>
    (this.data()?.recentActivity ?? []).map(apiActivityToPres),
  );

  onAddBill() {
    this.router.navigateByUrl('/bills/new');
  }

  onRecordPayment() {
    this.router.navigateByUrl('/payments/new');
  }

  onViewAll() {
    this.router.navigateByUrl('/history');
  }

  onActivityClick(item: PresActivityItem) {
    if (item.kind === 'bill') {
      this.router.navigateByUrl(`/bills/${item.id}`);
    }
  }
}
