/*
 * Public API Surface of api
 *
 * Pattern: interface-driven service consumption.
 *   - Consumers depend on contracts (interface + InjectionToken).
 *   - Concrete implementations are bound to tokens via useExisting in provideApi().
 *   - Tests swap implementations by re-binding the same token.
 */

// --- Token ---
export * from './lib/api-base-url.token';

// --- Models ---
export * from './lib/models/settings';
export * from './lib/models/update-settings-request';
export * from './lib/models/bill-status';
export * from './lib/models/bill';
export * from './lib/models/create-bill-request';
export * from './lib/models/update-bill-request';
export * from './lib/models/list-bills-params';
export * from './lib/models/payment-method';
export * from './lib/models/payment';
export * from './lib/models/create-payment-request';
export * from './lib/models/list-payments-params';
export * from './lib/models/activity-kind';
export * from './lib/models/activity-item';
export * from './lib/models/dashboard';
export * from './lib/models/history-entry';
export * from './lib/models/history-month';
export * from './lib/models/history';

// --- Contracts (import these from consumer code) ---
export * from './lib/services/settings.service.contract';
export * from './lib/services/bills.service.contract';
export * from './lib/services/payments.service.contract';
export * from './lib/services/dashboard.service.contract';
export * from './lib/services/history.service.contract';

// --- Implementations (import only at composition root) ---
export * from './lib/services/settings.service';
export * from './lib/services/bills.service';
export * from './lib/services/payments.service';
export * from './lib/services/dashboard.service';
export * from './lib/services/history.service';

// --- Composition helper ---
export * from './lib/provide-api';
