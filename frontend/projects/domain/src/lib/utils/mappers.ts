import type {
  ActivityItem as ApiActivityItem,
  Bill,
  HistoryEntry,
} from 'api';
import { ActivityKind, BillStatus } from 'api';
import type {
  ActivityItem as PresActivityItem,
  BillListItemData,
  BillStatus as PresBillStatus,
  TimelineEntry,
} from 'components';

const ICONS: Record<string, string> = {
  groceries: '🛒',
  hydro: '⚡',
  electric: '⚡',
  internet: '📱',
  phone: '📱',
  rent: '🏠',
  dinner: '🍕',
  food: '🍕',
};

export function iconForTitle(title: string): string {
  const lower = title.toLowerCase();
  for (const key of Object.keys(ICONS)) {
    if (lower.includes(key)) return ICONS[key]!;
  }
  return '💳';
}

export function billStatusToPres(status: BillStatus): PresBillStatus {
  return status === BillStatus.Settled ? 'settled' : 'unsettled';
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function monthLabel(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatCurrency(amount: number): string {
  return currency.format(amount);
}

export function billToListItem(bill: Bill): BillListItemData {
  return {
    id: bill.id,
    icon: iconForTitle(bill.description),
    title: bill.description,
    date: formatShortDate(bill.date),
    status: billStatusToPres(bill.status),
    total: bill.amount,
    partnerShare: bill.partnerShare,
  };
}

export function apiActivityToPres(item: ApiActivityItem): PresActivityItem {
  const isPayment = item.kind === ActivityKind.Payment;
  return {
    id: item.id,
    kind: isPayment ? 'payment' : 'bill',
    icon: isPayment ? '↓' : iconForTitle(item.title),
    title: item.title,
    meta: `${formatShortDate(item.date)} · ${formatCurrency(item.amount)}`,
    amount: Math.abs(item.balanceDelta),
    sub: isPayment ? 'Received' : "Partner's share",
  };
}

export function historyEntryToTimeline(entry: HistoryEntry): TimelineEntry {
  const isPayment = entry.kind === ActivityKind.Payment;
  return {
    id: entry.id,
    kind: isPayment ? 'payment' : 'bill',
    icon: isPayment ? '↓' : iconForTitle(entry.title),
    title: entry.title,
    meta: `${formatShortDate(entry.date)} · ${formatCurrency(entry.amount)}`,
    delta: entry.balanceDelta,
    balanceAfter: entry.runningBalance,
  };
}

export function entryIsBill(entry: HistoryEntry): boolean {
  return entry.kind === ActivityKind.Bill;
}

export function entryIsPayment(entry: HistoryEntry): boolean {
  return entry.kind === ActivityKind.Payment;
}
