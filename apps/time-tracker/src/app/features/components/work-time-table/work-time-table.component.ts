import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  viewChild,
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { WorkTime } from '../../../core/interfaces/work-time';
import { WorkTimeDataSource } from './work-time-datasource';
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgTemplateOutlet,
  TitleCasePipe,
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimePipe } from '../../../core/pipes/time/time.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { WorkTimeViewModel } from '../../interfaces/work-time.view-model';
import { toSignal } from '@angular/core/rxjs-interop';
import { WorkTimeDialogService } from '../../../core/services/dialog.service';
import { WorkTimeService } from '../../../core/services/work-time.service';
import { PaginatorService } from '../../../core/services/paginator.service';

@Component({
  selector: 'tt-work-time-table',
  templateUrl: './work-time-table.component.html',
  styleUrls: ['./work-time-table.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    NgClass,
    NgTemplateOutlet,
    TimePipe,
    TitleCasePipe,
  ],
  providers: [
    {
      provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
      useValue: { formFieldAppearance: 'outline' },
    },
    PaginatorService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTimeTableComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly workTimeDialogService = inject(WorkTimeDialogService);
  private readonly workTimeService = inject(WorkTimeService);
  private readonly paginatorService = inject(PaginatorService);

  readonly table = viewChild.required(MatTable<WorkTimeViewModel>);

  readonly isSmall = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((breakpoint) => breakpoint.matches)),
  );
  readonly displayedColumns: Signal<string[]> = computed(() =>
    this.isSmall()
      ? ['date', 'start', 'end', 'pause', 'type', 'actions']
      : ['date', 'start', 'end', 'pause', 'worked', 'type', 'notes', 'actions'],
  );

  readonly pageSizeOptions = this.paginatorService.pageSizeOptions;

  readonly pageSize = toSignal(this.paginatorService.pageSize$, {
    initialValue: this.paginatorService.pageSizeInitial,
  });

  readonly length = toSignal(this.workTimeService.count$(), {
    initialValue: 0,
  });

  readonly dataSource = new WorkTimeDataSource({
    pageSize: this.paginatorService.pageSizeInitial,
    pageIndex: 0,
    length: 0,
  });

  addRow() {
    this.workTimeDialogService.openDialog().subscribe();
  }

  editRow(workTime: WorkTime) {
    this.workTimeDialogService.openDialog(workTime).subscribe();
  }

  async deleteRow(workTime: WorkTime) {
    await this.workTimeService.delete(workTime.id);
  }

  changePage(pageEvent: PageEvent) {
    this.dataSource.changePage(pageEvent);
    this.paginatorService.changePage(pageEvent);
  }
}
