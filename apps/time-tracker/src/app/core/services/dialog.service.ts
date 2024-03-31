import { inject, Injectable } from '@angular/core';
import { WorkTime } from '../interfaces/work-time';
import { WorkTimeFormComponent } from '../../features/components/work-time-form/work-time-form.component';
import { filter, first, Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WorkTimeDialogService {
  private readonly dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);

  private dialogConfig?: MatDialogConfig;

  constructor() {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map((breakpoint) => breakpoint.matches),
        map((isHandset) =>
          isHandset
            ? {
                width: '95vw',
                maxWidth: '95vw',
                panelClass: 'mat-dialog-mobile',
              }
            : {},
        ),
      )
      .subscribe((config) => {
        this.dialogConfig = config;
      });
  }

  openDialog(workTime?: WorkTime): Observable<WorkTime> {
    const dialogRef = this.dialog.open<
      WorkTimeFormComponent,
      WorkTime,
      WorkTime
    >(WorkTimeFormComponent, {
      data: workTime,
      ...this.dialogConfig,
    });
    return dialogRef.afterClosed().pipe(
      first(),
      filter((value): value is WorkTime => value != null),
    );
  }
}
