import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { take } from 'rxjs';
import { WorkTime } from '../../core/entities/work-time.entity';
import { MatDialog } from '@angular/material/dialog';
import { TimeEntryFormComponent } from '../../time-entry-form/time-entry-form.component';
import { WorkTimeDataSource, WorkTimeViewModel } from './datasource';

@Component({
  selector: 'tt-time-table-view',
  templateUrl: './time-table-view.component.html',
  styleUrls: ['./time-table-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTableViewComponent {
  @ViewChild(MatTable)
  table!: MatTable<WorkTimeViewModel>;

  displayedColumns = ['date', 'time', 'pause', 'actions'] as const;
  dataSource = new WorkTimeDataSource();
  private readonly dialog = inject(MatDialog);

  addRow() {
    const dialogRef = this.dialog.open(TimeEntryFormComponent);
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((workTime: WorkTime) => {
        this.dataSource.addData(workTime);
      });
  }

  editRow(workTime: WorkTime) {
    const dialogRef = this.dialog.open(TimeEntryFormComponent, {
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
