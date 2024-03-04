import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
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
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { SettingsFormComponent } from '../settings-form/settings-form.component';
import { SettingsService } from '../../../core/services/settings.service';
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
    NgOptimizedImage,
    RouterModule
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements AfterViewInit {
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
      title: 'Backup',
      icon: 'local_police',
      link: '/backup',
    },
  ] as const;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);
  private readonly settingsService = inject(SettingsService);

  readonly isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  private dialogConfig?: MatDialogConfig;

  ngAfterViewInit(): void {
    this.isHandset$
      .pipe(
        map((isHandset) =>
          isHandset
            ? {
                width: '95vw',
                maxWidth: '95vw',
                panelClass: 'mat-dialog-mobile',
              }
            : {}
        )
      )
      .subscribe((config) => {
        this.dialogConfig = config;
      });
  }

  openSettingsDialog() {
    this.dialog.open(SettingsFormComponent, {
      data: this.settingsService.get(),
      ...this.dialogConfig,
    });
  }
}
