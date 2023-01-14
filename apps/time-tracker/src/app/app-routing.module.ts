import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './routes/overview/overview.component';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { ExportComponent } from './routes/export/export.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    component: OverviewComponent,
  },
  {
    path: 'calendar',
    loadComponent: () => CalendarComponent,
  },
  {
    path: 'export',
    loadComponent: () => ExportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
