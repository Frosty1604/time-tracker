import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  WorkTime,
  WorkTimePartial,
  WorkType,
} from '../core/entities/work-time.entity';
import {
  minutesToTime,
  stringToTime,
  timeToMinutes,
  timeToString,
} from '../utils/time';
import { WorkTimeService } from '../core/services/work-time.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { addDays, subDays } from 'date-fns';

@Component({
  templateUrl: './work-time-form.component.html',
  styleUrls: ['./work-time-form.component.scss'],
})
export class WorkTimeFormComponent {
  readonly pauseOptions: number[] = [];
  readonly typeOptions: WorkType[] = ['normal', 'sick', 'vacation'];
  private readonly data = inject<WorkTimePartial>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly isEditMode = this.data != null;

  readonly formGroup = new FormGroup({
    date: new FormControl(this.data?.date ?? new Date(), {
      validators: Validators.required,
    }),
    start: new FormControl(
      this.data?.start ? timeToString(this.data.start) : '09:30',
      { validators: Validators.required }
    ),
    end: new FormControl(
      this.data?.end ? timeToString(this.data.end) : '18:00',
      { validators: Validators.required }
    ),
    pause: new FormControl(
      this.data?.pause ? timeToMinutes(this.data.pause) : 30,
      {
        validators: Validators.required,
      }
    ),
    type: new FormControl<WorkType>(this.data?.type ?? 'normal', {
      validators: Validators.required,
    }),
  });

  readonly isFormInvalid$ = this.formGroup.statusChanges.pipe(
    map((status) => status !== 'VALID'),
    distinctUntilChanged()
  );
  private readonly workTimeService = inject(WorkTimeService);
  private readonly dialogRef = inject(MatDialogRef<WorkTimeFormComponent>);

  get date() {
    return this.formGroup.get('date');
  }
  get start() {
    return this.formGroup.get('start');
  }
  get end() {
    return this.formGroup.get('end');
  }
  get pause() {
    return this.formGroup.get('pause');
  }
  get type() {
    return this.formGroup.get('type');
  }

  constructor() {
    for (let i = 0; i < 120; i = i + 5) {
      this.pauseOptions.push(i);
    }
  }
  async submit() {
    const formData = this.formGroup.value;
    const workTime: WorkTimePartial = {
      start: stringToTime(formData?.start ? formData.start : ''),
      end: stringToTime(formData?.end ? formData.end : ''),
      pause: minutesToTime(formData?.pause ? formData.pause : 0),
      date: formData.date ?? new Date(),
      type: formData.type ?? 'normal',
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
