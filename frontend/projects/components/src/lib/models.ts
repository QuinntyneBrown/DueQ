export type BillStatus = 'settled' | 'unsettled' | 'partial';

export type IconTileKind = 'bill' | 'payment' | 'warn';

export type AvatarVariant = 'you' | 'partner' | 'default';

export type Tone = 'default' | 'positive' | 'negative' | 'muted';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type ButtonSize = 'md' | 'lg';

export interface ActivityItem {
  id: string;
  kind: 'bill' | 'payment';
  icon: string;
  title: string;
  meta: string;
  amount: number;
  amountLabel?: string;
  sub?: string;
  href?: string;
}

export interface BillListItemData {
  id: string;
  icon: string;
  title: string;
  date: string;
  status: BillStatus;
  total: number;
  partnerShare: number;
}

export interface TimelineEntry {
  id: string;
  kind: 'bill' | 'payment';
  icon: string;
  title: string;
  meta: string;
  delta: number;
  balanceAfter: number;
}

export interface SegmentedOption<T = string> {
  label: string;
  value: T;
}
