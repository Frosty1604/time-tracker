import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { take } from 'rxjs';
import { WorkTime } from '../../core/entities/work-time.entity';
import { MatDialog } from '@angular/material/dialog';
import { WorkTimeFormComponent } from '../../work-time-form/work-time-form.component';
import { WorkTimeDataSource, WorkTimeViewModel } from './work-time-datasource';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimePipe } from '../../core/pipes/time/time.pipe';
import { MatMenuModule } from '@angular/material/menu';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTimeTableComponent {
  @ViewChild(MatTable)
  table!: MatTable<WorkTimeViewModel>;

  displayedColumns = ['date', 'time', 'pause', 'actions'] as const;
  dataSource = new WorkTimeDataSource();
  private readonly dialog = inject(MatDialog);

  addRow() {
    const dialogRef = this.dialog.open(WorkTimeFormComponent);
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((workTime: WorkTime) => {
        this.dataSource.addData(workTime);
      });
  }

  editRow(workTime: WorkTime) {
    const dialogRef = this.dialog.open(WorkTimeFormComponent, {
      data: workTime,
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((workTime: WorkTime) => {
        this.dataSource.updateData(workTime as Required<WorkTime>);
      });
  }

  deleteRow(workTime: WorkTime) {
    if (workTime.id) {
      this.dataSource.removeData(workTime.id);
    }
  }
}
