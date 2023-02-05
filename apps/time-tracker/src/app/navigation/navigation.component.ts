import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
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
export class NavigationComponent implements OnDestroy {
  readonly navListItems: ReadonlyArray<NavListItem> = [
    {
      title: 'Overview',
      icon: 'donut_large',
      link: '/overview',
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
  private readonly router = inject(Router);

  private readonly ngDestroySubject = new Subject<void>();

  readonly isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  private defaultRedirectRoute = 'overview';

  constructor() {
    this.init();

    setTimeout(() => {
      void this.router.navigate([
        this.fallbackRouteToDefault(document.location.pathname || document.URL),
      ]);
    });
  }

  ngOnDestroy(): void {
    this.ngDestroySubject.next();
  }

  init() {
    this.router.events.pipe(
      takeUntil(this.ngDestroySubject),
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
      distinctUntilChanged()
    );
  }

  openSettingsDialog() {
    this.dialog.open(SettingsComponent, {
      data: this.settingsService.get(),
    });
  }

  private fallbackRouteToDefault(route: string) {
    return route !== '/' ? route : this.defaultRedirectRoute;
  }
}
