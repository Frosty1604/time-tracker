import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TileDetailsComponent } from '../tile-details/tile-details.component';
import { combineLatest, map, Observable } from 'rxjs';
import { WorkTimeService } from '../../../core/services/work-time.service';
import { WorkTime } from '../../../core/interfaces/work-time';
import { SettingsService } from '../../../core/services/settings.service';
import {
  calculateAvgWorkTime,
  calculateOvertime,
  calculateVacationDays,
  parseAvgWorkTime,
  parseOvertime,
} from '../../../utils/work-time.util';
import { shareReplay } from 'rxjs/operators';
import { Tile } from '../../interfaces/tile';
import { TileViewModel } from '../../interfaces/tile.view-model';

@Component({
  selector: 'tt-tile-container',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, TileDetailsComponent],
  templateUrl: './tile-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileContainerComponent {
  private readonly previousYear = new Date().getFullYear() - 1;
  private readonly workTimeService = inject(WorkTimeService);
  private readonly settings$ = inject(SettingsService).settings$;
  private readonly workTimes$: Observable<WorkTime[]> =
    this.workTimeService.store$;

  private readonly tileViewModel$: Observable<TileViewModel> = combineLatest([
    this.workTimes$,
    this.settings$,
  ]).pipe(
    map(([items, settings]) => ({ items, settings })),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  readonly hasEntries$ = this.tileViewModel$.pipe(
    map((data) => data.items.length > 0),
  );
  readonly tileAverageWorkTime$: Observable<Tile> = this.tileViewModel$.pipe(
    map(({ items }) => calculateAvgWorkTime(items)),
    map((avgTime) => parseAvgWorkTime(avgTime)),
    map((value) =>
      this.makeTileDetails('Average Hours/Day', 'functions', value, [
        `from-purple-500`,
        `to-pink-500`,
      ]),
    ),
  );

  readonly tileVacationDays$: Observable<Tile> = this.tileViewModel$.pipe(
    map(({ items, settings }) =>
      calculateVacationDays(items, settings, this.previousYear),
    ),
    map(({ available, total, taken }) =>
      this.makeTileDetails(
        'Vacation left',
        'beach_access',
        `${available} Days`,
        [`from-red-500`, `to-orange-500`],
        taken + ' of ' + total + ' days taken',
      ),
    ),
  );

  readonly tileOvertime$: Observable<Tile> = this.tileViewModel$.pipe(
    map(({ items, settings }) => calculateOvertime(items, settings)),
    map((overTimeInMinutes) => parseOvertime(overTimeInMinutes)),
    map((overtime) =>
      this.makeTileDetails(
        'Overtime',
        'schedule',
        overtime.replace(' hours', 'h').replace(' minutes', 'm'),
        ['from-blue-500', 'to-teal-500'],
      ),
    ),
  );

  private makeTileDetails(
    title: string,
    icon: string,
    value: string,
    colors: string[],
    tooltip?: string,
  ): Tile {
    return {
      title,
      icon,
      value,
      colors: ['bg-gradient-to-tr', ...colors],
      tooltip,
    };
  }
}
