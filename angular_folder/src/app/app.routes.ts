import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
    },
    {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions/transactions').then((m) => m.Transactions),
    },
    { path: '**', redirectTo: 'login' },
];
