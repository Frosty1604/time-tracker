import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { Settings } from '../../../core/interfaces/settings';
import { weekDays } from '../../../utils/work-time.util';

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
    TitleCasePipe
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

  readonly formGroup: FormGroup = this.fb.group({
    start: [this.data?.defaultTimes.start ?? '08:30'],
    end: [this.data?.defaultTimes.end ?? '17:15'],
    pause: [this.data?.defaultTimes.pause ?? '00:45'],
    workDays: this.fb.group({
      monday: [this.data?.workDays.includes('monday') ?? true],
      tuesday: [this.data?.workDays.includes('tuesday') ?? true],
      wednesday: [this.data?.workDays.includes('wednesday') ?? true],
      thursday: [this.data?.workDays.includes('thursday') ?? true],
      friday: [this.data?.workDays.includes('friday') ?? true],
      saturday: [this.data?.workDays.includes('saturday') ?? false],
      sunday: [this.data?.workDays.includes('sunday') ?? false],
    }),
    workTimePerDay: [this.data?.workTimePerDay ?? '08:00'],
    vacationDaysPerYear: [this.data?.vacationDaysPerYear ?? 25],
    previousYear: this.fb.group({
      overtime: [
        this.data?.previousYears?.[this.lastYear].remainingOvertime ?? '00:00',
      ],
      vacationDays: [
        this.data?.previousYears?.[this.lastYear].remainingVacationDays ?? 0,
      ],
    }),
  });

  async submit() {
    const formData = this.formGroup?.value;

    const settings: Settings = {
      workTimePerDay: formData.workTimePerDay,
      defaultTimes: {
        start: formData.start,
        end: formData.end,
        pause: formData.pause,
      },
      workDays: weekDays.filter((day) => formData.workDays[day]),
      vacationDaysPerYear: formData.vacationDaysPerYear,
      previousYears: {
        [this.lastYear]: {
          remainingOvertime: formData.previousYear.overtime,
          remainingVacationDays: formData.previousYear.vacationDays,
        },
      },
    };

    if (this.isEditMode) {
      await this.settingsService.upsert(settings);
    } else {
      await this.settingsService.upsert(settings);
    }
    this.dialogRef.close(settings);
  }
}
