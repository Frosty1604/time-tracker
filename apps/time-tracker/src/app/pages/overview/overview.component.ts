import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TileContainerComponent } from '../../features/components/tile-container/tile-container.component';
import { WorkTimeTableComponent } from '../../features/components/work-time-table/work-time-table.component';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TileContainerComponent,
    WorkTimeTableComponent,
  ],
  template: ` <div class="flex flex-col">
      <tt-tile-container></tt-tile-container>
      <tt-work-time-table #table></tt-work-time-table>
    </div>
    <div class="fixed bottom-5 right-5">
      <button mat-fab (click)="table.addRow()">
        <mat-icon fontIcon="add"></mat-icon>
      </button>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {}
