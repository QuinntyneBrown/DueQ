import { ActivityKind } from './activity-kind';

export interface ActivityItem {
  readonly id: string;
  readonly kind: ActivityKind;
  readonly title: string;
  readonly date: string;
  readonly amount: number;
  readonly balanceDelta: number;
}
