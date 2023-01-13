import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TileContainerComponent } from '../views/tile-container/tile-container.component';
import { WorkTimeTableComponent } from '../views/work-time-table/work-time-table.component';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TileContainerComponent,
    WorkTimeTableComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
