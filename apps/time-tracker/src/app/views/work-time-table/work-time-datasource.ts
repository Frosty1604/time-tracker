import {
  WorkTime,
  WorkTimePartial,
  WorkType,
} from '../../core/entities/work-time.entity';
import { DataSource } from '@angular/cdk/collections';
import {
  merge,
  Observable,
  ReplaySubject,
  scan,
  Subject,
  switchMap,
} from 'rxjs';
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
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { PageEvent } from '@angular/material/paginator';

type RowAction = RowActionUpsert | RowActionDelete;

interface RowActionUpsert {
  action: 'upsert';
  workTime: WorkTime;
}

interface RowActionDelete {
  action: 'delete';
  id: number;
}

export interface WorkTimeViewModel {
  date: Date;
  effectiveTime: Duration;
  pauseTime: Time;
  type: WorkType;
  isWorkDay: boolean;
  entity: WorkTimePartial;
  notes?: string;
}

export class WorkTimeDataSource extends DataSource<WorkTimeViewModel> {
  private readonly upsertDataSubject = new Subject<WorkTime>();
  private readonly removeDataSubject = new Subject<number>();
  private readonly changePageSubject = new ReplaySubject<PageEvent>(1);

  private readonly workTimeService = inject(WorkTimeService);

  constructor(private readonly pageEvent: PageEvent) {
    super();
    this.changePageSubject.next(pageEvent);
  }

  connect(): Observable<WorkTimeViewModel[]> {
    const initialItems$ = this.changePageSubject.pipe(
      switchMap(({ pageIndex, pageSize }) =>
        this.workTimeService.findPaged(pageIndex, pageSize)
      )
    );
    const rowActionUpsert = this.upsertDataSubject.pipe(
      map((workTime) => ({ action: 'upsert', workTime } as RowActionUpsert))
    );
    const rowActionDelete = this.removeDataSubject.pipe(
      switchMap((id) => this.workTimeService.delete(id)),
      map((id) => ({ action: 'delete', id } as RowActionDelete))
    );

    return merge(rowActionUpsert, rowActionDelete, initialItems$).pipe(
      scan<WorkTime[] | RowAction, Map<number, WorkTime>>((acc, value) => {
        if (Array.isArray(value)) {
          acc.clear();
          value.forEach((item) => acc.set(item.id, item));
          return acc;
        }
        if (value.action === 'upsert') {
          acc.set(value.workTime.id, value.workTime);
        } else if (value.action === 'delete') {
          acc.delete(value.id);
        }
        return acc;
      }, new Map<number, WorkTime>()),
      map((map) =>
        Array.from(map.values()).sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        )
      ),
      map((workTimeItems) => workTimeItems.map(this.workTimeToViewModel))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {
    this.upsertDataSubject.complete();
    this.removeDataSubject.complete();
    this.changePageSubject.complete();
  }

  addData(row: WorkTime) {
    this.upsertDataSubject.next(row);
  }

  updateData(row: WorkTime) {
    this.upsertDataSubject.next(row);
  }

  removeData(id: number) {
    this.removeDataSubject.next(id);
  }

  count$(): Observable<number> {
    return merge(
      this.upsertDataSubject.pipe(map(() => 1)),
      this.removeDataSubject.pipe(map(() => -1)),
      fromPromise(this.workTimeService.count())
    ).pipe(scan((acc, val) => acc + val));
  }

  changePage(pageEvent: PageEvent) {
    this.changePageSubject.next(pageEvent);
  }

  private workTimeToViewModel(workTime: WorkTimePartial): WorkTimeViewModel {
    return {
      date: workTime.date,
      effectiveTime: intervalToDuration({
        start: durationToDate(
          calculateWorkDuration(workTime.start, workTime.end)
        ),
        end: timeToDate(workTime.pause),
      }),
      pauseTime: workTime.pause,
      type: workTime.type,
      isWorkDay: workTime.type === 'normal',
      entity: workTime,
      notes: workTime?.notes,
    };
  }
}
