import { NgModule } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { de } from 'date-fns/locale';
import { WorkTimeFormComponent } from './work-time-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';

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
