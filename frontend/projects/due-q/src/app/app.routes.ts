import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { Shell } from './shell/shell';
import type { HeaderConfig } from './shell/shell';

const headerData = (header: HeaderConfig) => ({ header });

export const routes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in-page').then((m) => m.SignInPage),
  },
  {
    path: 'create-account',
    loadComponent: () =>
      import('./pages/create-account/create-account-page').then(
        (m) => m.CreateAccountPage,
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password-page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password-page').then(
        (m) => m.ResetPasswordPage,
      ),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page').then((m) => m.DashboardPage),
        data: headerData({ title: 'DueQ', action: { kind: 'gear', route: '/settings' } }),
      },
      {
        path: 'bills',
        loadComponent: () => import('./pages/bills/bills-page').then((m) => m.BillsPage),
        data: headerData({ title: 'Bills', action: { kind: 'add-bill', route: '/bills/new' } }),
      },
      {
        path: 'bills/new',
        loadComponent: () =>
          import('./pages/add-bill/add-bill-page').then((m) => m.AddBillPage),
        data: headerData({ title: 'Add Bill', action: { kind: 'cancel', route: '/dashboard' } }),
      },
      {
        path: 'bills/:id',
        loadComponent: () =>
          import('./pages/bill-detail/bill-detail-page').then((m) => m.BillDetailPage),
        data: headerData({ title: 'Bill', action: null }),
      },
      {
        path: 'payments/new',
        loadComponent: () =>
          import('./pages/record-payment/record-payment-page').then(
            (m) => m.RecordPaymentPage,
          ),
        data: headerData({ title: 'Record Payment', action: { kind: 'cancel', route: '/dashboard' } }),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/history/history-page').then((m) => m.HistoryPage),
        data: headerData({ title: 'History', action: null }),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings-page').then((m) => m.SettingsPage),
        data: headerData({ title: 'Settings', action: { kind: 'skip', route: '/dashboard' } }),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
