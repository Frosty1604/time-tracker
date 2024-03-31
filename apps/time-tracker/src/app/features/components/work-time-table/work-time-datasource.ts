import { WorkTimePartial } from '../../../core/interfaces/work-time';
import { DataSource } from '@angular/cdk/collections';
import {
  combineLatest,
  Observable,
  ReplaySubject,
  startWith,
  switchMap,
} from 'rxjs';
import { inject } from '@angular/core';
import { WorkTimeService } from '../../../core/services/work-time.service';
import { intervalToDuration } from 'date-fns';
import {
  calculateWorkDuration,
  durationToDate,
  timeToDate,
} from '../../../utils/time.util';
import { WorkTimeViewModel } from '../../interfaces/work-time.view-model';
import { PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs/operators';

export class WorkTimeDataSource extends DataSource<WorkTimeViewModel> {
  private readonly workTimeService = inject(WorkTimeService);
  private readonly pageEventSubject = new ReplaySubject<PageEvent>(1);

  constructor(private readonly pageEvent: PageEvent) {
    super();
    this.pageEventSubject.next(this.pageEvent);
  }

  connect(): Observable<WorkTimeViewModel[]> {
    return combineLatest([
      this.pageEventSubject,
      this.workTimeService.storeChange$.pipe(startWith(null)),
    ]).pipe(
      switchMap(([{ pageIndex, pageSize }]) =>
        this.workTimeService.findPaged(pageIndex, pageSize),
      ),
      map((workTimeItems) => workTimeItems.map(this.workTimeToViewModel)),
    );
  }

  override disconnect() {
    this.pageEventSubject.complete();
  }

  changePage(pageEvent: PageEvent) {
    this.pageEventSubject.next(pageEvent);
  }

  private workTimeToViewModel(workTime: WorkTimePartial): WorkTimeViewModel {
    return {
      date: workTime.date,
      effectiveTime: intervalToDuration({
        start: durationToDate(
          calculateWorkDuration(workTime.start, workTime.end),
        ),
        end: timeToDate(workTime.pause),
      }),
      startTime: workTime.start,
      endTime: workTime.end,
      pauseTime: workTime.pause,
      type: workTime.type,
      isWorkDay: workTime.type === 'normal' || workTime.type === 'remote',
      entity: workTime,
      notes: workTime?.notes,
    };
  }
}
