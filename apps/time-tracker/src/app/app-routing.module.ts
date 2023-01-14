import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./routes/overview/overview.component').then(
        (mod) => mod.OverviewComponent
      ),
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
