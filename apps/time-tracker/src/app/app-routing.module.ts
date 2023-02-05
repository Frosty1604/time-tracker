import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { CustomTitleStrategy } from './core/services/custom-title-strategy.service';
import { OverviewComponent } from './routes/overview/overview.component';

const routes: Routes = [
  {
    path: 'overview',
    title: 'Overview',
    component: OverviewComponent,
  },
  {
    path: 'calendar',
    title: 'Calendar',
    loadComponent: () =>
      import('./routes/calendar/calendar.component').then(
        (mod) => mod.CalendarComponent
      ),
  },
  {
    path: 'backup',
    title: 'Import/Export Database',
    loadComponent: () =>
      import('./routes/backup/backup.component').then(
        (mod) => mod.BackupComponent
      ),
  },
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
  ],
})
export class AppRoutingModule {}
