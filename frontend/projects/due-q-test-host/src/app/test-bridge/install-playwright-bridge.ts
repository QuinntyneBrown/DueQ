import type { IPlaywrightBridge } from './playwright-bridge';

export function installPlaywrightBridge(): IPlaywrightBridge {
  const controllers = new Map<string, object>();
  const bridge: IPlaywrightBridge = {
    calls: [],

    recordCall(method, args) {
      this.calls.push({ method, args: [...args], ts: Date.now() });
    },

    callsFor(method) {
      return this.calls.filter((call) => call.method === method);
    },

    reset() {
      this.calls.length = 0;
    },

    registerController(name, controller) {
      controllers.set(name, controller);
    },

    controller<T extends object>(name: string): T | undefined {
      return controllers.get(name) as T | undefined;
    },
  };

  window.__pluginHostBridge = bridge;
  return bridge;
}
