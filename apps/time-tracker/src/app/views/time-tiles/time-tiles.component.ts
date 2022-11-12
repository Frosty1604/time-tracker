import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../core/services/db.service';
import { MatCardModule } from '@angular/material/card';
import { TileComponent } from './tile/tile.component';
import { map } from 'rxjs';
import { durationToDate, timeToDate } from '../../utils/time';
import {
  differenceInMinutes,
  formatDuration,
  hoursToMinutes,
  minutesInHour,
  minutesToHours,
} from 'date-fns';

@Component({
  selector: 'tt-time-tiles',
  standalone: true,
  imports: [CommonModule, MatCardModule, TileComponent],
  templateUrl: './time-tiles.component.html',
  styleUrls: ['./time-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTilesComponent {
  tileAverageWorkTime$ = this.dbService.getAllData('dayEntry').pipe(
    map((workTimeModels) => {
      const workTimeSum = workTimeModels.reduce((prev, curr) => {
        return (
          prev +
          hoursToMinutes(curr.duration.hours ?? 0) +
          (curr.duration.minutes ?? 0)
        );
      }, 0);
      return {
        title: 'Average Hours/Day',
        icon: 'functions',
        value:
          (workTimeSum / workTimeModels.length / 60).toPrecision(3) + ' hours',
      };
    })
  );
  tileWorkDayOff$ = this.dbService.getAllData('dayEntry').pipe(
    map((workTimeModels) => {
      const daysOff = workTimeModels.reduce(
        (prev, curr) => (curr.holiday ? prev + 1 : prev),
        0
      );
      return {
        title: 'Days Off',
        icon: 'beach_access',
        value: daysOff,
      };
    })
  );
  workHoursNeeded = 8;
  tileOvertime$ = this.dbService.getAllData('dayEntry').pipe(
    map((workTimeModels) => {
      return workTimeModels.reduce((prev, curr) => {
        const realWorkTime = differenceInMinutes(
          durationToDate(curr.duration),
          timeToDate(curr.pause)
        );
        if (curr.date.getDay() === 0 || curr.date.getDay() === 6) {
          return prev + realWorkTime; // todo make map for working days
        }
        return prev + realWorkTime - this.workHoursNeeded * minutesInHour;
      }, 0);
    }),
    map((overTimeInMinutes) => {
      return {
        title: 'Overtime',
        icon: 'schedule',
        value: formatDuration(
          {
            minutes: overTimeInMinutes % minutesInHour,
            hours: minutesToHours(overTimeInMinutes),
          },
          { format: ['hours', 'minutes'] }
        ),
      };
    })
  );

  constructor(private dbService: DbService) {}
}
