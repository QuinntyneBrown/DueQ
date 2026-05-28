import type { BridgeActivityKind } from './BridgeActivityKind';

export interface BridgeActivityItem {
  readonly id: string;
  readonly kind: BridgeActivityKind;
  readonly title: string;
  readonly date: string;
  readonly amount: number;
  readonly balanceDelta: number;
}
