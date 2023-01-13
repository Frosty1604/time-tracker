import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  CalendarCommonModule,
  CalendarEvent,
  CalendarMonthModule,
  CalendarWeekModule,
} from 'angular-calendar';
import { addHours, addMinutes, formatDuration, startOfDay } from 'date-fns';
import { EventColor } from 'calendar-utils';
import { map, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { WorkTimeService } from '../core/services/work-time.service';
import { WorkTimePartial, WorkType } from '../core/entities/work-time.entity';
import { calculateWorkDuration } from '../utils/time';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#16c439',
    secondary: '#70b97f',
    secondaryText: '#fff',
  },
} as const;

const workTypeColors: Record<WorkType, EventColor> = {
  normal: colors['blue'],
  vacation: colors['green'],
  sick: colors['yellow'],
};

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    NgIf,
  ],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private workTimeService = inject(WorkTimeService);
  viewDate: Date = new Date();
  events$: Observable<CalendarEvent[]> = fromPromise(
    this.workTimeService.find()
  ).pipe(
    map((workTimes) =>
      workTimes.map((workTime) => {
        return this.convertToEvent(workTime);
      })
    )
  );

  private convertToEvent(workTime: WorkTimePartial): CalendarEvent {
    return {
      start: addMinutes(
        addHours(startOfDay(workTime.date), workTime.start.hours),
        workTime.start.minutes
      ),
      end: addMinutes(
        addHours(startOfDay(workTime.date), workTime.end.hours),
        workTime.end.minutes
      ),
      title:
        workTime.type === 'normal'
          ? formatDuration(
              calculateWorkDuration(workTime.start, workTime.end),
              {
                format: ['hours', 'minutes'],
              }
            )
          : workTime.type.toUpperCase(),
      allDay: workTime.type !== 'normal',
      color: workTypeColors[workTime.type],
    };
  }
}
