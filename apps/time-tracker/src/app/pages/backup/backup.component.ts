import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  exhaustMap,
  filter,
  forkJoin,
  merge,
  Observable,
  scan,
  startWith,
  Subject,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { WorkTimeService } from '../../core/services/work-time.service';
import exportFromJSON from 'export-from-json';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { WorkTime, WorkTimePartial } from '../../core/interfaces/work-time';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

interface ViewModel {
  fileName: string;
  disableImport: boolean;
}

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    AsyncPipe
],
  templateUrl: './backup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupComponent {
  private readonly snackbarService = inject(MatSnackBar);

  private readonly workTimeService = inject(WorkTimeService);

  private readonly exportSubject = new Subject<void>();

  private readonly fileSubject = new Subject<File | null>();

  private readonly importSubject = new Subject<void>();

  private readonly fileName$: Observable<string> = this.fileSubject.pipe(
    map((file) => file?.name ?? '')
  );

  private readonly disableImport$: Observable<boolean> = this.fileSubject.pipe(
    map((file) => file == null),
    startWith(true)
  );

  private readonly export$ = this.exportSubject.asObservable().pipe(
    switchMap(() => this.workTimeService.find()),
    map((data) => this.export(data))
  );

  private readonly import$ = zip([
    this.importSubject,
    this.fileSubject.pipe(filter((file) => file != null)) as Observable<File>,
  ]).pipe(
    switchMap(([, file]) => file.text()),
    switchMap((fileContent) => this.parseJson(fileContent)),
    exhaustMap((workTimeEntries: WorkTimePartial[]) =>
      forkJoin(
        workTimeEntries.map((workTime) => {
          delete workTime.id;
          workTime.date = new Date(workTime.date);
          return this.workTimeService.insert(workTime);
        })
      )
    ),
    map((entries) => entries.length),
    tap((count) => {
      this.snackbarService.open(`Imported ${count} entries successfully`);
    })
  );

  readonly viewModel$: Observable<ViewModel> = merge(
    this.fileName$.pipe(map((fileName) => ({ fileName }))),
    this.disableImport$.pipe(map((disableImport) => ({ disableImport }))),
    this.export$.pipe(map(() => ({}))),
    this.import$.pipe(map(() => ({ fileName: '', disableImport: true })))
  ).pipe(
    scan(
      (state: ViewModel, command: Partial<ViewModel>) => {
        return {
          ...state,
          ...command,
        };
      },
      {
        disableImport: true,
        fileName: '',
      }
    )
  );

  exportData() {
    this.exportSubject.next();
  }

  importData() {
    this.importSubject.next();
  }

  handleFileChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileSubject.next(file);
    }
  }

  private export(data: WorkTime[]) {
    exportFromJSON({
      data,
      fileName: 'timetracker-db',
      exportType: 'json',
      fileNameFormatter: (name) => `${new Date().toLocaleDateString()}-${name}`,
    });
  }

  private parseJson(json: string): Promise<WorkTimePartial[]> {
    return new Promise((resolve, reject) => {
      try {
        const parsedJson = JSON.parse(json);
        resolve(parsedJson);
      } catch (e) {
        if (e instanceof Error) {
          this.snackbarService.open(e.message, 'Dismiss');
        }
        reject(e);
      }
    });
  }
}
