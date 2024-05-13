import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const appRoutes: Routes = [
  {
    path: '',
    title: 'Overview',
    loadComponent: () => import('./pages/overview/overview.component'),
  },
  {
    path: 'calendar',
    title: 'Calendar',
    providers: [
      importProvidersFrom(
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
      ),
    ],
    loadComponent: () => import('./pages/calendar/calendar.component'),
  },
  {
    path: 'backup',
    title: 'Import/Export Database',
    loadComponent: () => import('./pages/backup/backup.component'),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/overview/overview.component'),
  },
];
