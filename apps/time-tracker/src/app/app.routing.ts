import { Routes } from '@angular/router';
import { OverviewComponent } from './routes/overview/overview.component';

export const ROUTES: Routes = [
  {
    path: 'overview',
    component: OverviewComponent,
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./routes/calendar/calendar.component').then(
        (mod) => mod.CalendarComponent
      ),
  },
  {
    path: 'export',
    loadComponent: () =>
      import('./routes/export/export.component').then(
        (mod) => mod.ExportComponent
      ),
  },
];
