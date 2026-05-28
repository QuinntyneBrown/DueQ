import type { IPlaywrightBridge } from './playwright-bridge';

declare global {
  interface Window {
    __pluginHostBridge?: IPlaywrightBridge;
  }
}
