export type BillStatus = 'settled' | 'unsettled' | 'partial';
export type BillStatusValue = BillStatus | number;

export type IconTileKind = 'bill' | 'payment' | 'warn';
export type IconTileKindValue = IconTileKind | number;

export type ActivityKind = 'bill' | 'payment';
export type ActivityKindValue = ActivityKind | number;

export type AvatarVariant = 'you' | 'partner' | 'default';

export type Tone = 'default' | 'positive' | 'negative' | 'muted';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type ButtonSize = 'md' | 'lg';

export type LinkTarget = string | unknown[] | null;

export interface ActivityItem {
  id: string;
  kind: ActivityKindValue;
  icon: string;
  title: string;
  meta: string;
  amount: number;
  amountLabel?: string;
  sub?: string;
  href?: LinkTarget;
}

export interface BillListItemData {
  id: string;
  icon: string;
  title: string;
  date: string;
  dateLabel?: string;
  status: BillStatusValue;
  statusLabel?: string;
  total: number;
  totalLabel?: string;
  partnerShare: number;
  partnerShareLabel?: string;
  href?: LinkTarget;
}

export interface TimelineEntry {
  id: string;
  kind: ActivityKindValue;
  icon: string;
  title: string;
  meta: string;
  delta: number;
  deltaLabel?: string;
  balanceAfter: number;
  balanceLabel?: string;
}

export interface SegmentedOption<T = string> {
  label: string;
  value: T;
}

export function normalizeBillStatus(status: BillStatusValue | null | undefined): BillStatus {
  if (status === 1 || status === 'settled') return 'settled';
  if (status === 2 || status === 'partial') return 'partial';
  return 'unsettled';
}

export function normalizeActivityKind(kind: ActivityKindValue | null | undefined): ActivityKind {
  return kind === 1 || kind === 'payment' ? 'payment' : 'bill';
}

export function normalizeIconTileKind(kind: IconTileKindValue | null | undefined): IconTileKind {
  if (kind === 1 || kind === 'payment') return 'payment';
  if (kind === 2 || kind === 'warn') return 'warn';
  return 'bill';
}
