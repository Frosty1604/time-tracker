import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { filter, take } from 'rxjs';
import { WorkTimeWithID, WorkType } from '../../core/entities/work-time.entity';
import { MatDialog } from '@angular/material/dialog';
import { WorkTimeFormComponent } from '../../work-time-form/work-time-form.component';
import { WorkTimeDataSource, WorkTimeViewModel } from './work-time-datasource';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimePipe } from '../../core/pipes/time/time.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'tt-work-time-table',
  templateUrl: './work-time-table.component.html',
  styleUrls: ['./work-time-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    TimePipe,
    MatChipsModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTimeTableComponent {
  @ViewChild(MatTable)
  table!: MatTable<WorkTimeViewModel>;
  readonly displayedColumns = [
    'date',
    'time',
    'pause',
    'type',
    'actions',
  ] as const;
  readonly dataSource = new WorkTimeDataSource();
  private readonly dialog = inject(MatDialog);
  typeColors: Record<WorkType | any, ThemePalette> = {
    normal: 'primary',
    sick: 'warn',
    vacation: 'accent',
  };

  addRow() {
    this.openDialog().subscribe((workTime) =>
      this.dataSource.addData(<WorkTimeWithID>workTime)
    );
  }

  editRow(workTime: WorkTimeWithID) {
    this.openDialog(workTime).subscribe((workTime) =>
      this.dataSource.updateData(<WorkTimeWithID>workTime)
    );
  }

  deleteRow(workTime: WorkTimeWithID) {
    this.dataSource.removeData(workTime.id);
  }

  private openDialog(workTime?: WorkTimeWithID) {
    const dialogRef = this.dialog.open<
      WorkTimeFormComponent,
      WorkTimeWithID,
      WorkTimeWithID
    >(WorkTimeFormComponent, { data: workTime });
    return dialogRef.afterClosed().pipe(
      filter((value) => value != null),
      take(1)
    );
  }
}
