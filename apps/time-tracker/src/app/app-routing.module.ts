import { importProvidersFrom, NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { CustomTitleStrategy } from './core/services/custom-title-strategy.service';
import { OverviewComponent } from './pages/overview/overview.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const routes: Routes = [
  {
    path: '',
    title: 'Overview',
    component: OverviewComponent,
  },
  {
    path: 'calendar',
    title: 'Calendar',
    providers: [
      importProvidersFrom(
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        })
      ),
    ],
    loadComponent: () =>
      import('./pages/calendar/calendar.component').then(
        (mod) => mod.CalendarComponent
      ),
  },
  {
    path: 'backup',
    title: 'Import/Export Database',
    loadComponent: () =>
      import('./pages/backup/backup.component').then(
        (mod) => mod.BackupComponent
      ),
  },
  {
    path: '**',
    component: OverviewComponent,
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
