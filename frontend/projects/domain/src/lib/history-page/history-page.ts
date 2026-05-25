import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  Chip,
  ChipGroup,
  PageHead,
  RunningBalanceCard,
  TimelineGroup,
  TimelineRow,
} from 'components';
import { HISTORY_SERVICE, type History, type HistoryMonth } from 'api';
import {
  entryIsBill,
  entryIsPayment,
  formatCurrency,
  historyEntryToTimeline,
  monthLabel,
} from '../utils/mappers';

type Filter = 'all' | 'bills' | 'payments';

@Component({
  selector: 'lib-history-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, ChipGroup, PageHead, RunningBalanceCard, TimelineGroup, TimelineRow],
  templateUrl: './history-page.html',
  styleUrl: './history-page.scss',
})
export class HistoryPage {
  private readonly historyService = inject(HISTORY_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly data = toSignal<History | null, null>(this.historyService.get(), {
    initialValue: null,
  });

  readonly filter = toSignal(
    this.route.queryParamMap.pipe(
      map((p) => {
        const k = p.get('kind');
        if (k === 'bills') return 'bills' as Filter;
        if (k === 'payments') return 'payments' as Filter;
        return 'all' as Filter;
      }),
    ),
    { initialValue: 'all' as Filter },
  );

  readonly runningBalance = computed(() => Math.max(0, this.data()?.runningBalance ?? 0));
  readonly totalLogged = computed(() => this.data()?.totalLogged ?? 0);
  readonly totalReceived = computed(() => this.data()?.totalReceived ?? 0);

  readonly months = computed(() => {
    const months = this.data()?.months ?? [];
    const f = this.filter();
    return months
      .map((m: HistoryMonth) => {
        const entries = m.entries.filter((e) => {
          if (f === 'bills') return entryIsBill(e);
          if (f === 'payments') return entryIsPayment(e);
          return true;
        });
        return {
          key: `${m.year}-${m.month}`,
          label: monthLabel(m.year, m.month),
          totalLabel: `${m.monthDelta >= 0 ? '+' : '−'}${formatCurrency(Math.abs(m.monthDelta))}`,
          rows: entries.map(historyEntryToTimeline),
        };
      })
      .filter((m) => m.rows.length > 0);
  });

  setFilter(f: Filter) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { kind: f === 'all' ? null : f },
      queryParamsHandling: 'merge',
    });
  }
}
