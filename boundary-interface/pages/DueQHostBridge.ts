import type { BridgeCall } from './BridgeCall';

export interface DueQHostBridge {
  readonly calls: BridgeCall[];
  callsFor(method: string): BridgeCall[];
  controller<T extends object>(name: string): T | undefined;
}
