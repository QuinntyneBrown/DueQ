import type { DueQHostBridge } from './DueQHostBridge';

declare global {
  interface Window {
    __pluginHostBridge?: DueQHostBridge;
  }
}
