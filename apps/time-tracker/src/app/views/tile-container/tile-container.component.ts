import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  TileDetails,
  TileDetailsComponent,
} from '../tile-details/tile-details.component';
import { combineLatest, map, Observable, startWith, switchMap } from 'rxjs';
import { WorkTimeService } from '../../core/services/work-time.service';
import { WorkTime } from '../../core/entities/work-time.entity';
import { SettingsService } from '../../core/services/settings.service';
import { Settings } from '../../core/entities/settings.entity';
import {
  calculateAvgWorkTime,
  calculateOvertime,
  calculateVacationDays,
  makeTileDetails,
  parseAvgWorkTime,
  parseOvertime,
} from '../../utils/worktime';
import { shareReplay } from 'rxjs/operators';

interface TileData {
  settings: Settings | undefined;
  items: WorkTime[];
}

@Component({
  selector: 'tt-tile-container',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, NgIf, TileDetailsComponent],
  templateUrl: './tile-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileContainerComponent {
  private readonly previousYear = new Date().getFullYear() - 1;
  private readonly workTimeService = inject(WorkTimeService);
  private readonly storeChange$ = this.workTimeService.storeChange$;
  private readonly settings$ = inject(SettingsService).settings$;
  private readonly workTimes$: Observable<WorkTime[]> = this.storeChange$.pipe(
    startWith(null),
    switchMap(() => this.workTimeService.find())
  );

  private readonly tileViewModel$: Observable<TileData> = combineLatest([
    this.workTimes$,
    this.settings$,
  ]).pipe(
    map(([items, settings]) => ({ items, settings })),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  readonly hasEntries$ = this.tileViewModel$.pipe(
    map((data) => data.items.length > 0)
  );
  readonly tileAverageWorkTime$: Observable<TileDetails> =
    this.tileViewModel$.pipe(
      map(({ items }) => calculateAvgWorkTime(items)),
      map((avgTime) => parseAvgWorkTime(avgTime)),
      map((value) =>
        makeTileDetails('Average Hours/Day', 'functions', value, [
          `from-purple-500`,
          `to-pink-500`,
        ])
      )
    );

  readonly tileVacationDays$: Observable<TileDetails> =
    this.tileViewModel$.pipe(
      map(({ items, settings }) =>
        calculateVacationDays(items, settings, this.previousYear)
      ),
      map(({ available, total, taken }) =>
        makeTileDetails(
          'Vacation left',
          'beach_access',
          `${available} Days`,
          [`from-red-500`, `to-orange-500`],
          taken + ' of ' + total + ' days taken'
        )
      )
    );

  readonly tileOvertime$: Observable<TileDetails> = this.tileViewModel$.pipe(
    map(({ items, settings }) => calculateOvertime(items, settings)),
    map((overTimeInMinutes) => parseOvertime(overTimeInMinutes)),
    map((overtime) =>
      makeTileDetails(
        'Overtime',
        'schedule',
        overtime.replace(' hours', 'h').replace(' minutes', 'm'),
        ['from-blue-500', 'to-teal-500']
      )
    )
  );
}
