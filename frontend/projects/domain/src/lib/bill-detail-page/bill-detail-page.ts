import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BackLink,
  Button,
  DetailAmount,
  DetailHeader,
  KeyValueList,
  KeyValueRow,
  NoteCard,
  SplitBar,
  SplitLegend,
} from 'components';
import { BILLS_SERVICE, BillStatus, SETTINGS_SERVICE, type Bill } from 'api';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import {
  billStatusToPres,
  formatCurrency,
  formatLongDate,
  iconForTitle,
} from '../utils/mappers';

@Component({
  selector: 'lib-bill-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BackLink,
    Button,
    ConfirmDialog,
    DetailAmount,
    DetailHeader,
    KeyValueList,
    KeyValueRow,
    NoteCard,
    SplitBar,
    SplitLegend,
  ],
  templateUrl: './bill-detail-page.html',
  styleUrl: './bill-detail-page.scss',
})
export class BillDetailPage {
  private readonly billsService = inject(BILLS_SERVICE);
  private readonly settings = inject(SETTINGS_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly params = toSignal(this.route.paramMap, { requireSync: true });

  readonly bill = signal<Bill | null>(null);
  readonly notFound = signal<boolean>(false);
  readonly confirmingDelete = signal<boolean>(false);

  private readonly profile = toSignal(this.settings.get(), {
    initialValue: { yourName: 'You', partnerName: 'Partner' },
  });

  constructor() {
    effect(() => {
      const id = this.params().get('id');
      if (!id) {
        this.notFound.set(true);
        this.bill.set(null);
        return;
      }
      this.notFound.set(false);
      this.billsService.get(id).subscribe({
        next: (b) => this.bill.set(b),
        error: () => {
          this.notFound.set(true);
          this.bill.set(null);
        },
      });
    });
  }

  readonly icon = computed(() => iconForTitle(this.bill()?.description ?? ''));
  readonly status = computed(() => billStatusToPres(this.bill()?.status ?? BillStatus.Unsettled));
  readonly statusLabel = computed(() => (this.status() === 'settled' ? 'Settled' : 'Unsettled'));
  readonly loggedOn = computed(() => {
    const b = this.bill();
    return b ? `Logged ${formatLongDate(b.createdAt)}` : '';
  });
  readonly dateLong = computed(() => {
    const b = this.bill();
    return b ? formatLongDate(b.date) : '';
  });
  readonly yourShare = computed(() => {
    const b = this.bill();
    return b ? b.amount - b.partnerShare : 0;
  });
  readonly partnerShareLabel = computed(() => `+${formatCurrency(this.bill()?.partnerShare ?? 0)}`);
  readonly partnerName = computed(() => this.profile().partnerName || 'Partner');
  readonly yourName = computed(() => this.profile().yourName || 'You');
  readonly partnerShareKey = computed(() => `${this.partnerName()}'s share`);

  onMarkSettled() {
    const b = this.bill();
    if (!b) return;
    this.billsService.settle(b.id).subscribe((updated) => this.bill.set(updated));
  }

  onMarkUnsettled() {
    const b = this.bill();
    if (!b) return;
    this.billsService.unsettle(b.id).subscribe((updated) => this.bill.set(updated));
  }

  onDeleteClick() {
    this.confirmingDelete.set(true);
  }

  onCancelDelete() {
    this.confirmingDelete.set(false);
  }

  onConfirmDelete() {
    const b = this.bill();
    if (!b) return;
    this.billsService.delete(b.id).subscribe(() => {
      this.confirmingDelete.set(false);
      this.router.navigateByUrl('/bills');
    });
  }

  onEdit() {
    const b = this.bill();
    if (!b) return;
    this.router.navigateByUrl(`/bills/${b.id}/edit`);
  }
}
