import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  WorkTime,
  WorkTimeWithID,
  WorkType,
} from '../core/entities/work-time.entity';
import {
  minutesToTime,
  stringToTime,
  timeToMinutes,
  timeToString,
} from '../utils/time';
import { WorkTimeService } from '../core/services/work-time.service';

@Component({
  templateUrl: './work-time-form.component.html',
  styleUrls: ['./work-time-form.component.scss'],
})
export class WorkTimeFormComponent {
  readonly pauseOptions: number[] = [];
  readonly typeOptions: WorkType[] = ['normal', 'sick', 'vacation'];
  private readonly data = inject<WorkTime>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly isEditMode = this.data != null;

  readonly formGroup = new FormGroup({
    date: new FormControl(this.data?.date ?? new Date(), {
      nonNullable: true,
      validators: Validators.required,
    }),
    start: new FormControl(
      this.data?.start ? timeToString(this.data.start) : '09:30',
      { nonNullable: true, validators: Validators.required }
    ),
    end: new FormControl(
      this.data?.end ? timeToString(this.data.end) : '18:00',
      { nonNullable: true, validators: Validators.required }
    ),
    pause: new FormControl(
      this.data?.pause ? timeToMinutes(this.data.pause) : 30,
      {
        nonNullable: true,
        validators: Validators.required,
      }
    ),
    type: new FormControl<WorkType>(this.data?.type ?? 'normal', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });
  private readonly workTimeService = inject(WorkTimeService);
  private readonly dialogRef = inject(MatDialogRef<WorkTimeFormComponent>);

  constructor() {
    for (let i = 0; i < 120; i = i + 5) {
      this.pauseOptions.push(i);
    }
  }
  async submit() {
    const formData = this.formGroup.value;
    const workTime: WorkTime = {
      id: this.data?.id,
      start: stringToTime(formData?.start ? formData.start : ''),
      end: stringToTime(formData?.end ? formData.end : ''),
      pause: minutesToTime(formData?.pause ? formData.pause : 0),
      date: formData.date ?? new Date(),
      type: formData.type ?? 'normal',
    };
    if (this.isEditMode) {
      await this.workTimeService.update(workTime as WorkTimeWithID);
    } else {
      await this.workTimeService.add(workTime);
    }
    this.dialogRef.close(workTime);
  }
}
