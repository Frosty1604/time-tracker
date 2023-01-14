import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { WorkTimeService } from '../../core/services/work-time.service';
import exportFromJSON from 'export-from-json';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportComponent implements OnInit, OnDestroy {
  private readonly workTimeData = inject(WorkTimeService).find();
  private readonly exportSubject = new Subject<void>();
  private readonly onDestroySubject = new Subject<void>();

  ngOnInit(): void {
    this.exportSubject
      .asObservable()
      .pipe(
        switchMap(() => this.workTimeData),
        takeUntil(this.onDestroySubject)
      )
      .subscribe((data) => {
        exportFromJSON({
          data,
          fileName: 'timetracker-db',
          exportType: 'json',
          fileNameFormatter: (name) =>
            `${new Date().toLocaleDateString()}-${name}`,
        });
      });
  }

  ngOnDestroy() {
    this.onDestroySubject.next();
  }

  exportData() {
    this.exportSubject.next();
  }
}
