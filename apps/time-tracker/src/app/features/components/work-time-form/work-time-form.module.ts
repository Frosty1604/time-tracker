import { NgModule } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { de } from 'date-fns/locale';
import { WorkTimeFormComponent } from './work-time-form.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatDateFnsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatRadioModule,
    NgForOf,
    TitleCasePipe,
    AsyncPipe,
    NgIf,
  ],
  providers: [
    [
      MatDatepickerModule,
      {
        provide: MAT_DATE_LOCALE,
        useValue: de,
      },
    ],
  ],
  exports: [WorkTimeFormComponent],
  declarations: [WorkTimeFormComponent],
})
export class WorkTimeFormModule {}
