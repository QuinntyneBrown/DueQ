import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test-bridge',
    loadComponent: () =>
      import('./test-bridge/test-bridge-page').then((m) => m.TestBridgePage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'test-bridge' },
];
