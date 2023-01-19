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
import { MatInputModule } from '@angular/material/input';
import { WorkTimePartial } from '../../core/entities/work-time.entity';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatInputModule],
  templateUrl: './export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportComponent implements OnInit, OnDestroy {
  private readonly workTimeService = inject(WorkTimeService);
  private readonly exportSubject = new Subject<void>();
  private readonly onDestroySubject = new Subject<void>();

  ngOnInit(): void {
    this.exportSubject
      .asObservable()
      .pipe(
        switchMap(() => this.workTimeService.find()),
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

  async fileChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    if (file) {
      const json = await file.text();
      try {
        const dbData: WorkTimePartial[] = JSON.parse(json);
        for (const workTime of dbData) {
          delete workTime.id;
          workTime.date = new Date(workTime.date);
          await this.workTimeService.insert(workTime);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
