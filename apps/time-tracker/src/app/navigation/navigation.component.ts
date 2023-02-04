import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../routes/settings/settings.component';
import { SettingsService } from '../core/services/settings.service';
import { MatRippleModule } from '@angular/material/core';

interface NavListItem {
  title: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'tt-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatSidenavModule,
    MatToolbarModule,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  readonly navListItems: ReadonlyArray<NavListItem> = [
    {
      title: 'Overview',
      icon: 'donut_large',
      link: '/',
    },
    {
      title: 'Calendar',
      icon: 'calendar_month',
      link: '/calendar',
    },
    {
      title: 'Export',
      icon: 'upload',
      link: '/export',
    },
  ] as const;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);
  private readonly settingsService = inject(SettingsService);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  openSettingsDialog() {
    this.dialog.open(SettingsComponent, {
      data: this.settingsService.get(),
    });
  }
}
