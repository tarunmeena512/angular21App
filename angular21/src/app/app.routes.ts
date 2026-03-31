import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { DashboardPage } from './components/dashboard-page/dashboard-page';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LandingPage,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
    canActivate: [authGuard], // Safeguards this route
  },
];
