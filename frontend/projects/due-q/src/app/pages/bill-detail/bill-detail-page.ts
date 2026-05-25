import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BILLS_SERVICE, Bill, BillStatus, IBillsService, ISettingsService, SETTINGS_SERVICE } from 'api';
import { iconForBill } from '../bills/bills-page';

@Component({
  selector: 'app-bill-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './bill-detail-page.html',
  styleUrl: './bill-detail-page.scss',
})
export class BillDetailPage {
  readonly id = input.required<string>();

  private readonly billsService = inject<IBillsService>(BILLS_SERVICE);
  private readonly settingsService = inject<ISettingsService>(SETTINGS_SERVICE);
  private readonly router = inject(Router);

  protected readonly confirmingDelete = signal(false);
  protected readonly working = signal(false);

  private readonly settings = resource({
    loader: () => firstValueFrom(this.settingsService.get()),
  });

  protected readonly bill = resource<Bill, string>({
    params: () => this.id(),
    loader: ({ params }) => firstValueFrom(this.billsService.get(params)),
  });

  protected readonly notFound = computed(() => {
    const err = this.bill.error();
    if (!err) return false;
    const e = err as { status?: number };
    return e.status === 404 || e.status === 400;
  });

  protected readonly value = computed(() => this.bill.value());

  protected readonly partnerName = computed(() => this.settings.value()?.partnerName ?? 'Partner');
  protected readonly yourName = computed(() => this.settings.value()?.yourName ?? 'You');

  protected readonly statusLabel = computed(() =>
    this.value()?.status === BillStatus.Settled ? 'Settled' : 'Unsettled',
  );
  protected readonly isSettled = computed(() => this.value()?.status === BillStatus.Settled);

  protected readonly yourShare = computed(() => {
    const v = this.value();
    return v ? v.partnerShare : 0;
  });
  protected readonly partnerShare = computed(() => this.value()?.partnerShare ?? 0);

  protected readonly amountText = computed(() =>
    formatCurrency(this.value()?.amount ?? 0),
  );
  protected readonly yourShareText = computed(() => formatCurrency(this.yourShare()));
  protected readonly partnerShareText = computed(() => formatCurrency(this.partnerShare()));
  protected readonly partnerShareSigned = computed(() => `+${this.partnerShareText()}`);

  protected readonly dateLong = computed(() => formatLongDate(this.value()?.date));
  protected readonly loggedLine = computed(() => {
    const created = this.value()?.createdAt;
    if (!created) return '';
    return `Logged ${formatLongDate(created)}`;
  });
  protected readonly metaLine = computed(() => {
    const v = this.value();
    if (!v) return '';
    return `${formatLongDate(v.date)} · ${iconForBill(v.description)} ${categoryFor(v.description)}`;
  });

  protected readonly icon = computed(() => iconForBill(this.value()?.description ?? ''));
  protected readonly category = computed(() => categoryFor(this.value()?.description ?? ''));

  async toggleSettled(): Promise<void> {
    const v = this.value();
    if (!v || this.working()) return;
    this.working.set(true);
    try {
      if (v.status === BillStatus.Settled) {
        await firstValueFrom(this.billsService.unsettle(v.id));
      } else {
        await firstValueFrom(this.billsService.settle(v.id));
      }
      this.bill.reload();
    } finally {
      this.working.set(false);
    }
  }

  openDeleteConfirm(): void {
    this.confirmingDelete.set(true);
  }
  closeDeleteConfirm(): void {
    this.confirmingDelete.set(false);
  }
  async confirmDelete(): Promise<void> {
    const v = this.value();
    if (!v || this.working()) return;
    this.working.set(true);
    try {
      await firstValueFrom(this.billsService.delete(v.id));
      this.confirmingDelete.set(false);
      await this.router.navigateByUrl('/bills');
    } finally {
      this.working.set(false);
    }
  }
}

function formatCurrency(value: number): string {
  return new CurrencyPipe('en-US').transform(value, 'USD', 'symbol', '1.2-2') ?? `$${value.toFixed(2)}`;
}

function formatLongDate(date: string | undefined): string {
  if (!date) return '';
  const normalized = date.length === 10 ? `${date}T00:00:00` : date;
  return new DatePipe('en-US').transform(normalized, 'MMMM d, yyyy') ?? date;
}

function categoryFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('grocer') || t.includes('costco') || t.includes('loblaw')) return 'Groceries';
  if (t.includes('hydro') || t.includes('electric')) return 'Utilities';
  if (t.includes('internet') || t.includes('bell') || t.includes('rogers')) return 'Internet';
  if (t.includes('rent') || t.includes('mortgage')) return 'Rent';
  if (t.includes('dinner') || t.includes('lunch') || t.includes('pizza')) return 'Dining';
  return 'Bill';
}
