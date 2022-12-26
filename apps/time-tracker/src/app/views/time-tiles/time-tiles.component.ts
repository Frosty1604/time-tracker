import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TileComponent } from './tile/tile.component';
import { map } from 'rxjs';
import {
  calculateWorkDuration,
  durationToDate,
  timeToDate,
} from '../../utils/time';
import {
  differenceInMinutes,
  formatDuration,
  hoursToMinutes,
  minutesInHour,
  minutesToHours,
} from 'date-fns';
import { WorkTimeService } from '../../core/services/work-time.service';

@Component({
  selector: 'tt-time-tiles',
  standalone: true,
  imports: [CommonModule, MatCardModule, TileComponent],
  templateUrl: './time-tiles.component.html',
  styleUrls: ['./time-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTilesComponent {
  private readonly workHoursNeeded = 8;
  private readonly workTimeService = inject(WorkTimeService);

  tileAverageWorkTime$ = this.workTimeService.find().pipe(
    map((workTimeModels) => {
      const workTimeSum = workTimeModels.reduce((prev, curr) => {
        const duration = calculateWorkDuration(curr.start, curr.end);
        return (
          prev + hoursToMinutes(duration.hours ?? 0) + (duration.minutes ?? 0)
        );
      }, 0);
      return {
        title: 'Average Hours/Day',
        icon: 'functions',
        value:
          (workTimeSum / workTimeModels.length / 60).toPrecision(3) + ' hours',
        colors: [
          'bg-gradient-to-tr',
          `from-purple-500`,
          `to-pink-500`,
          `dark:from-purple-500`,
          `dark:to-pink-500`,
        ],
      };
    })
  );
  tileDaysOff$ = this.workTimeService.find().pipe(
    map((workTimeModels) => {
      const daysOff = workTimeModels.reduce(
        (prev, curr) => (curr.type === 'vacation' ? prev + 1 : prev),
        0
      );
      return {
        title: 'Days Off',
        icon: 'beach_access',
        value: daysOff,
        colors: [
          'bg-gradient-to-tr',
          `from-red-500`,
          `to-orange-500`,
          `dark:from-red-500`,
          `dark:to-orange-500`,
        ],
      };
    })
  );
  tileOvertime$ = this.workTimeService.find().pipe(
    map((workTimeModels) =>
      workTimeModels.reduce((prev, curr) => {
        const realWorkTime = differenceInMinutes(
          durationToDate(calculateWorkDuration(curr.start, curr.end)),
          timeToDate(curr.pause)
        );
        if (curr.date.getDay() === 0 || curr.date.getDay() === 6) {
          return prev + realWorkTime; // todo make map for working days
        }
        return prev + realWorkTime - this.workHoursNeeded * minutesInHour;
      }, 0)
    ),
    map((overTimeInMinutes) => ({
      title: 'Overtime',
      icon: 'schedule',
      value: formatDuration(
        {
          minutes: overTimeInMinutes % minutesInHour,
          hours: minutesToHours(overTimeInMinutes),
        },
        { format: ['hours', 'minutes'] }
      ),
      colors: [
        'bg-gradient-to-tr',
        `from-blue-500`,
        `to-teal-500`,
        `dark:from-blue-500`,
        `dark:to-teal-500`,
      ],
    }))
  );
}
