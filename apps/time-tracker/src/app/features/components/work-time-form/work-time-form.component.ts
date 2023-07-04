import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {
  WorkTime,
  WorkTimePartial,
  WorkType,
  workTypes,
} from '../../../core/interfaces/work-time';
import { stringToTime, timeToString } from '../../../utils/time.util';
import { WorkTimeService } from '../../../core/services/work-time.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { addDays, subDays } from 'date-fns';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  templateUrl: './work-time-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkTimeFormComponent {
  readonly typeOptions: ReadonlyArray<WorkType> = workTypes;

  private readonly data = inject<WorkTimePartial>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly isEditMode = this.data != null;

  private readonly settings = inject(SettingsService).get();

  readonly formGroup = new FormGroup({
    date: new FormControl(this.data?.date ?? new Date(), {
      validators: Validators.required,
      nonNullable: true,
    }),
    start: new FormControl(
      this.data?.start
        ? timeToString(this.data.start)
        : this.settings.defaultTimes.start,
      { validators: Validators.required, nonNullable: true }
    ),
    end: new FormControl(
      this.data?.end
        ? timeToString(this.data.end)
        : this.settings.defaultTimes.end,
      { validators: Validators.required, nonNullable: true }
    ),
    pause: new FormControl(
      this.data?.pause
        ? timeToString(this.data.pause)
        : this.settings.defaultTimes.pause,
      {
        validators: Validators.required,
        nonNullable: true,
      }
    ),
    type: new FormControl<WorkType>(this.data?.type ?? 'normal', {
      validators: Validators.required,
      nonNullable: true,
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  readonly isFormInvalid$ = this.formGroup.statusChanges.pipe(
    map((status) => status !== 'VALID'),
    distinctUntilChanged()
  );

  private readonly workTimeService = inject(WorkTimeService);

  private readonly dialogRef = inject(MatDialogRef<WorkTimeFormComponent>);

  get date() {
    return this.formGroup.controls.date;
  }

  get start() {
    return this.formGroup.controls.start;
  }

  get end() {
    return this.formGroup.controls.end;
  }

  get pause() {
    return this.formGroup.controls.pause;
  }

  get type() {
    return this.formGroup.controls.type;
  }

  get notes() {
    return this.formGroup.controls.notes;
  }

  async submit() {
    const workTime: WorkTimePartial = {
      start: stringToTime(this.start.value),
      end: stringToTime(this.end.value),
      pause: stringToTime(this.pause.value),
      date: this.date.value,
      type: this.type.value,
      notes: this.notes.value ?? undefined,
    };
    if (this.isEditMode) {
      workTime.id = this.data?.id;
      await this.workTimeService.update(workTime as WorkTime);
    } else {
      workTime.id = await this.workTimeService.insert(workTime);
    }
    this.dialogRef.close(workTime);
  }

  previousDay() {
    const nextDay = subDays(this.date?.value ?? new Date(), 1);
    this.date?.setValue(nextDay);
  }

  nextDay() {
    const nextDay = addDays(this.date?.value ?? new Date(), 1);
    this.date?.setValue(nextDay);
  }
}
