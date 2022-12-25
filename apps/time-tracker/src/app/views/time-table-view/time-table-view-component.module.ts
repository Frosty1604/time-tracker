import { NgModule } from '@angular/core';
import { TimeTableViewComponent } from './time-table-view.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { de } from 'date-fns/locale';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TimePipe } from '../../core/pipes/time/time.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDateFnsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    TimePipe,
    MatMenuModule,
  ],
  declarations: [TimeTableViewComponent],
  exports: [TimeTableViewComponent],
  providers: [
    MatDatepickerModule,
    {
      provide: MAT_DATE_LOCALE,
      useValue: de,
    },
  ],
})
export class TimeTableViewComponentModule {}
