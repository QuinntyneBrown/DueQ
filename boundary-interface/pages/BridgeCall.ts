export interface BridgeCall {
  readonly method: string;
  readonly args: readonly unknown[];
  readonly ts: number;
}
