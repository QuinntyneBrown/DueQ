import type { Routes } from '@angular/router';
import { AddBillPage } from './add-bill-page/add-bill-page';
import { AppShell } from './app-shell/app-shell';
import { BillDetailPage } from './bill-detail-page/bill-detail-page';
import { BillsPage } from './bills-page/bills-page';
import { DashboardPage } from './dashboard-page/dashboard-page';
import { HistoryPage } from './history-page/history-page';
import { RecordPaymentPage } from './record-payment-page/record-payment-page';
import { SettingsPage } from './settings-page/settings-page';

export const domainRoutes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPage, title: 'DueQ — Dashboard' },
      { path: 'bills', component: BillsPage, title: 'DueQ — Bills' },
      { path: 'bills/new', component: AddBillPage, title: 'DueQ — Add bill' },
      { path: 'bills/:id', component: BillDetailPage, title: 'DueQ — Bill' },
      { path: 'payments/new', component: RecordPaymentPage, title: 'DueQ — Record payment' },
      { path: 'history', component: HistoryPage, title: 'DueQ — History' },
      { path: 'settings', component: SettingsPage, title: 'DueQ — Settings' },
    ],
  },
];
