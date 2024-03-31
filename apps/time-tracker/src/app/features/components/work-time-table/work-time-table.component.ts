import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Observable, startWith, Subject, tap } from 'rxjs';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTimeTableComponent {
  @ViewChild(MatTable)
  readonly table!: MatTable<WorkTimeViewModel>;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly workTimeDialogService = inject(WorkTimeDialogService);
  private readonly workTimeService = inject(WorkTimeService);

  isSmall = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((breakpoint) => breakpoint.matches)),
  );
  displayedColumns: Signal<string[]> = computed(() =>
    this.isSmall()
      ? ['date', 'start', 'end', 'pause', 'type', 'actions']
      : ['date', 'start', 'end', 'pause', 'worked', 'type', 'notes', 'actions'],
  );

  readonly pageSizeOptions = [5, 10, 30, 60, 100] as const;

  private readonly pageSizeKey = 'pageSize';

  private readonly pageSize = localStorage.getItem(this.pageSizeKey)
    ? Number(localStorage.getItem(this.pageSizeKey))
    : this.pageSizeOptions[0];

  private readonly pageEventSubject = new Subject<PageEvent>();

  readonly pageSize$: Observable<number> = this.pageEventSubject.pipe(
    map(({ pageSize }) => pageSize),
    tap((pageSize) => this.savePageSize(pageSize)),
    startWith(this.pageSize),
  );

  readonly dataSource = new WorkTimeDataSource({
    pageSize: this.pageSize,
    pageIndex: 0,
    length: 0,
  });

  readonly length$ = this.workTimeService.count$();

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
    this.pageEventSubject.next(pageEvent);
    this.dataSource.changePage(pageEvent);
  }

  private savePageSize(pageSize: number) {
    localStorage.setItem(this.pageSizeKey, pageSize.toString());
  }
}
