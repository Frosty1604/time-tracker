import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../core/services/db.service';
import { MatCardModule } from '@angular/material/card';
import { TileComponent } from './tile/tile.component';
import { map } from 'rxjs';

@Component({
  selector: 'tt-time-tiles',
  standalone: true,
  imports: [CommonModule, MatCardModule, TileComponent],
  templateUrl: './time-tiles.component.html',
  styleUrls: ['./time-tiles.component.scss'],
})
export class TimeTilesComponent {
  tileWorkDays$ = this.dbService.getAllData('dayEntry').pipe(
    map((workTimeModels) => {
      return {
        title: 'Days',
        icon: 'apartment',
        value: workTimeModels.length,
      };
    })
  );
  tileWorkHours$ = this.dbService.getAllData('dayEntry').pipe(
    map((workTimeModels) => {
      const hours = workTimeModels.reduce(
        (prev, curr) =>
          curr?.duration?.hours ? prev + curr.duration.hours : 0,
        0
      );
      return {
        title: 'Hours',
        icon: 'schedule',
        value: hours,
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

  constructor(private dbService: DbService) {}
}
