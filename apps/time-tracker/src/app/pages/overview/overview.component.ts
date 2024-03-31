import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TileContainerComponent } from '../../features/components/tile-container/tile-container.component';
import { WorkTimeTableComponent } from '../../features/components/work-time-table/work-time-table.component';
import { WorkTimeService } from '../../core/services/work-time.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmptyTablePlaceholderComponent } from '../../features/components/empty-table-placeholder/empty-table-placeholder.component';
import { WorkTimeDialogService } from '../../core/services/dialog.service';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TileContainerComponent,
    WorkTimeTableComponent,
    EmptyTablePlaceholderComponent,
  ],
  template: `
    @if (hasEntries()) {
      <div class="flex flex-col">
        <tt-tile-container />
        <tt-work-time-table />
      </div>
      <div class="fixed bottom-5 right-5">
        <button mat-fab (click)="addEntry()">
          <mat-icon fontIcon="add" />
        </button>
      </div>
    } @else {
      <tt-empty-table-placeholder (action)="addEntry()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  private readonly workTimeDialogService = inject(WorkTimeDialogService);
  private readonly workTimeService = inject(WorkTimeService);

  readonly hasEntries = toSignal(
    this.workTimeService.storeChange$.pipe(
      startWith(this.workTimeService.count$),
      switchMap(() => this.workTimeService.count()),
      map((count) => count > 0),
    ),
  );

  addEntry() {
    this.workTimeDialogService.openDialog().subscribe();
  }
}
