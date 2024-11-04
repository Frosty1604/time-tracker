import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettingsService } from '../../../core/services/settings.service';
import { defaultSettings, Settings } from '../../../core/interfaces/settings';
import { weekDays } from '../../../utils/work-time.util';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { stringToTime, timeToString } from '../../../utils/time.util';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TitleCasePipe,
    JsonPipe,
  ],
  templateUrl: './settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFormComponent {
  readonly lastYear = new Date().getFullYear() - 1;

  readonly weekDays = weekDays;

  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SettingsService);
  private readonly dialogRef = inject(MatDialogRef<SettingsFormComponent>);
  private readonly data = inject<Settings>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly isEditMode = this.data != null;

  readonly formGroup = this.fb.nonNullable.group({
    start: [
      timeToString(
        this.data?.defaultTimes.start ?? defaultSettings.defaultTimes.start,
      ),
    ],
    end: [
      timeToString(
        this.data?.defaultTimes.end ?? defaultSettings.defaultTimes.end,
      ),
    ],
    pause: [
      timeToString(
        this.data?.defaultTimes.pause ?? defaultSettings.defaultTimes.pause,
      ),
    ],
    workDays: this.fb.nonNullable.group({
      monday: [this.data?.workDays.includes('monday') ?? true],
      tuesday: [this.data?.workDays.includes('tuesday') ?? true],
      wednesday: [this.data?.workDays.includes('wednesday') ?? true],
      thursday: [this.data?.workDays.includes('thursday') ?? true],
      friday: [this.data?.workDays.includes('friday') ?? true],
      saturday: [this.data?.workDays.includes('saturday') ?? false],
      sunday: [this.data?.workDays.includes('sunday') ?? false],
    }),
    workTimePerDay: [
      timeToString(this.data?.workTimePerDay ?? defaultSettings.workTimePerDay),
    ],
    vacationDaysPerYear: [this.data?.vacationDaysPerYear ?? 25],
    previousYear: this.fb.group({
      overtime: [
        timeToString(
          this.data?.previousYears?.[this.lastYear]?.remainingOvertime ?? {
            minutes: 0,
            hours: 0,
          },
        ),
      ],
      vacationDays: [
        this.data?.previousYears?.[this.lastYear]?.remainingVacationDays ?? 0,
      ],
    }),
  });

  readonly previousYears: {
    year: number;
    vacationDays: number;
    overtime: string;
  }[] = Object.entries(this.data?.previousYears || [])
    .map(([year, { remainingOvertime, remainingVacationDays }]) => ({
      year: coerceNumberProperty(year),
      overtime: remainingOvertime,
      vacationDays: coerceNumberProperty(remainingVacationDays),
    }))
    .filter((entry) => entry.year < new Date().getFullYear() - 1);

  async submit() {
    const formData = this.formGroup?.value;

    const settings: Settings = {
      workTimePerDay: stringToTime(formData.workTimePerDay),
      defaultTimes: {
        start: stringToTime(formData.start),
        end: stringToTime(formData.end),
        pause: stringToTime(formData.pause),
      },
      workDays: weekDays.filter((day) => !!formData?.workDays?.[day]),
      vacationDaysPerYear: formData.vacationDaysPerYear!,
      previousYears: {
        [this.lastYear]: {
          remainingOvertime: stringToTime(formData?.previousYear?.overtime),
          remainingVacationDays: formData.previousYear!.vacationDays!,
        },
      },
    };

    if (this.isEditMode) {
      this.settingsService.upsert(settings);
    } else {
      this.settingsService.upsert(settings);
    }
    this.dialogRef.close(settings);
  }
}
