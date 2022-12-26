import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { de } from 'date-fns/locale';
import { TimeEntryFormComponent } from './time-entry-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
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
  exports: [TimeEntryFormComponent],
  declarations: [TimeEntryFormComponent],
})
export class TimeEntryFormModule {}
