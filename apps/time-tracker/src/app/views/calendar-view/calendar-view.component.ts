import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarCommonModule,
  CalendarEvent,
  CalendarMonthModule,
  CalendarWeekModule,
} from 'angular-calendar';
import { addHours, addMinutes, formatDuration, startOfDay } from 'date-fns';
import { EventColor } from 'calendar-utils';
import { DbService } from '../../core/services/db.service';
import { map, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WorkTimeModel } from '../../core/models/work-time.model';
import { MatIconModule } from '@angular/material/icon';

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

@Component({
  selector: 'tt-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    MatButtonModule,
    CalendarCommonModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarViewComponent {
  viewDate: Date = new Date();
  events$: Observable<CalendarEvent[]> = this.DBService.getAllData(
    'dayEntry'
  ).pipe(
    map((workTimes) =>
      workTimes.map((workTime) => {
        return this.convertToEvent(workTime);
      })
    )
  );

  constructor(private readonly DBService: DbService) {}

  private convertToEvent(workTime: WorkTimeModel): CalendarEvent {
    return {
      start: addMinutes(
        addHours(startOfDay(workTime.date), workTime.start.hours),
        workTime.start.minutes
      ),
      end: addMinutes(
        addHours(startOfDay(workTime.date), workTime.end.hours),
        workTime.end.minutes
      ),
      title: workTime.holiday
        ? 'Holiday'
        : formatDuration(workTime.duration, {
            format: ['hours', 'minutes'],
          }),
      allDay: workTime.holiday,
      color: workTime.holiday ? colors['green'] : undefined,
    };
  }
}
