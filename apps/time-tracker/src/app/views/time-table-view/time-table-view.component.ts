import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DbService } from '../../core/services/db.service';
import { map, merge, Observable, scan } from 'rxjs';
import { WorkTimeModel } from '../../core/models/work-time.model';
import { DataSource } from '@angular/cdk/collections';
import { intervalToDuration } from 'date-fns';
import { Time } from '@angular/common';
import { durationToTime, timeToDate } from '../../utils/time';

interface RowWrapper {
  value: WorkTimeModel;
  startString: string;
  endString: string;
  edit: boolean;
}

@Component({
  selector: 'tt-time-table-view',
  templateUrl: './time-table-view.component.html',
  styleUrls: ['./time-table-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTableViewComponent {
  @ViewChild(MatTable)
  table!: MatTable<RowWrapper>;

  displayedColumns = ['date', 'time', 'pause', 'holiday', 'actions'];
  dataSource = new WorkTimeDataSource(this.dbService);

  pauseOptions: number[] = [];

  constructor(private dbService: DbService) {
    for (let i = 30; i <= 90; i = i + 5) {
      this.pauseOptions.push(i);
    }
  }

  addRow() {
    this.dataSource.addData({
      value: {
        date: new Date(),
        start: { hours: 9, minutes: 0 },
        end: { hours: 18, minutes: 0 },
        duration: { hours: 8, minutes: 15 },
        pause: { hours: 0, minutes: 45 },
        holiday: false,
      },
      startString: '09:00',
      endString: '18:00',
      edit: true,
    });
  }

  saveRow(row: RowWrapper) {
    row.value.duration = this.calculateWorkDuration(row.value);
    this.dataSource.updateData(row);
    row.edit = false;
  }

  editRow(row: RowWrapper) {
    row.edit = true;
  }

  deleteRow(row: RowWrapper) {
    if (row.value.id) {
      this.dataSource.removeData(row.value.id);
    }
  }

  cancelEdit(row: RowWrapper) {
    row.edit = false;
  }

  startTimeChanged(time: string, workTimeModel: WorkTimeModel) {
    workTimeModel.start = this.convertTime(time);
  }

  endTimeChanged(time: string, workTimeModel: WorkTimeModel) {
    workTimeModel.end = this.convertTime(time);
  }

  private calculateWorkDuration(workTimeModel: WorkTimeModel) {
    return intervalToDuration({
      start: timeToDate(workTimeModel.start),
      end: timeToDate(workTimeModel.end),
    });
  }

  private convertTime(time: string): Time {
    const [hours, minutes] = time.split(':');
    return { hours: Number(hours), minutes: Number(minutes) };
  }
}

type RowAction = RowActionAdd | RowActionUpdate | RowActionDelete;

interface RowActionAdd {
  action: 'add';
  workTime: WorkTimeModel;
}

interface RowActionUpdate {
  action: 'update';
  id: string;
}

interface RowActionDelete {
  action: 'delete';
  id: string;
}

class WorkTimeDataSource extends DataSource<RowWrapper> {
  private readonly initialItems$: Observable<RowWrapper[]> = this.dbService
    .getAllData('dayEntry')
    .pipe(
      map((entries) =>
        entries.map((value) => ({
          value,
          startString: durationToTime(value.start),
          endString: durationToTime(value.end),
          edit: false,
        }))
      )
    );

  constructor(private dbService: DbService) {
    super();
  }

  connect(): Observable<RowWrapper[]> {
    return merge(
      this.dbService.addedItem$.pipe(
        map(
          (workTime) => ({ action: 'add', workTime: workTime } as RowActionAdd)
        )
      ),
      this.dbService.deletedItem$.pipe(
        map((id) => ({ action: 'delete', id } as RowActionDelete))
      ),
      this.dbService.updatedItem$.pipe(
        map((id) => ({ action: 'update', id } as RowActionUpdate))
      ),
      this.initialItems$
    ).pipe(
      scan<RowWrapper[] | RowAction, RowWrapper[]>((acc, value) => {
        if (Array.isArray(value)) {
          return acc.concat(value);
        }

        switch (value.action) {
          case 'add':
            acc.push(<RowWrapper>{
              value: value.workTime,
              edit: true,
              startString: durationToTime(value.workTime.start),
              endString: durationToTime(value.workTime.end),
            });
            console.log('added:', value.workTime);
            break;
          case 'delete':
            console.log(
              'deleted:',
              acc.find((m) => m.value.id === value.id)
            );
            acc.splice(
              acc.findIndex((m) => m.value.id === value.id),
              1
            );
            break;
          case 'update':
            console.log(
              'updated: ',
              acc.find((m) => m.value.id === value.id)
            );
            break;
        }
        return acc;
      }, [])
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}

  addData(row: RowWrapper) {
    this.dbService.addItem(row.value);
  }

  updateData(row: RowWrapper) {
    this.dbService.updateItem(row.value);
  }

  removeData(id: string) {
    this.dbService.deleteItem(id);
  }
}
