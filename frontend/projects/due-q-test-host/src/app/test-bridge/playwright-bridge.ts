import type { BridgeCall } from './bridge-call';

export interface IPlaywrightBridge {
  readonly calls: BridgeCall[];

  recordCall(method: string, args: readonly unknown[]): void;
  callsFor(method: string): BridgeCall[];
  reset(): void;
  registerController<T extends object>(name: string, controller: T): void;
  controller<T extends object>(name: string): T | undefined;
}
