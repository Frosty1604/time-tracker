import { WorkTime, WorkTimeWithID } from '../../core/entities/work-time.entity';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, scan, Subject } from 'rxjs';
import { inject } from '@angular/core';
import { WorkTimeService } from '../../core/services/work-time.service';
import { map } from 'rxjs/operators';
import { Time } from '@angular/common';
import { intervalToDuration } from 'date-fns';
import {
  calculateWorkDuration,
  durationToDate,
  timeToDate,
} from '../../utils/time';

type RowAction = RowActionAdd | RowActionUpdate | RowActionDelete;

interface RowActionAdd {
  action: 'add';
  workTime: WorkTimeWithID;
}

interface RowActionUpdate {
  action: 'update';
  workTime: WorkTimeWithID;
}

interface RowActionDelete {
  action: 'delete';
  id: number;
}

export interface WorkTimeViewModel {
  date: Date;
  effectiveTime: Duration;
  pauseTime: Time;
  entity: WorkTime;
}

export class WorkTimeDataSource extends DataSource<WorkTimeViewModel> {
  private readonly addDataSubject = new Subject<WorkTime>();
  private readonly updateDataSubject = new Subject<WorkTimeWithID>();
  private readonly removeDataSubject = new Subject<number>();

  private readonly workTimeService = inject(WorkTimeService);

  connect(): Observable<WorkTimeViewModel[]> {
    const initialItems$ = this.workTimeService.find();
    return merge(
      this.addDataSubject
        .asObservable()
        .pipe(
          map(
            (workTime) =>
              ({ action: 'add', workTime: workTime } as RowActionAdd)
          )
        ),
      this.updateDataSubject.pipe(
        map((workTime) => ({ action: 'update', workTime } as RowActionUpdate))
      ),
      this.removeDataSubject.pipe(
        map((id) => ({ action: 'delete', id } as RowActionDelete))
      ),
      initialItems$
    ).pipe(
      scan<WorkTimeWithID[] | RowAction, Map<number, WorkTimeWithID>>(
        (acc, value) => {
          if (Array.isArray(value)) {
            value.forEach((item) => acc.set(item.id, item));
            return acc;
          }
          if (value.action === 'update' || value.action === 'add') {
            acc.set(value.workTime.id, value.workTime);
          } else if (value.action === 'delete') {
            acc.delete(value.id);
          }
          return acc;
        },
        new Map<number, WorkTimeWithID>()
      ),
      map((map) => Array.from(map.values())),
      map((workTimeItems) => workTimeItems.map(this.workTimeToViewModel))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}

  addData(row: WorkTime) {
    this.addDataSubject.next(row);
  }

  updateData(row: WorkTimeWithID) {
    this.updateDataSubject.next(row);
  }

  removeData(id: number) {
    this.removeDataSubject.next(id);
  }

  private workTimeToViewModel(workTime: WorkTime): WorkTimeViewModel {
    return {
      date: workTime.date,
      effectiveTime: intervalToDuration({
        start: durationToDate(
          calculateWorkDuration(workTime.start, workTime.end)
        ),
        end: timeToDate(workTime.pause),
      }),
      pauseTime: workTime.pause,
      entity: workTime,
    };
  }
}
