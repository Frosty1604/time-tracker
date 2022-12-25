import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTableViewComponentModule } from '../views/time-table-view/time-table-view-component.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TimeTilesComponent } from '../views/time-tiles/time-tiles.component';
import { CalendarViewComponent } from '../views/calendar-view/calendar-view.component';

@Component({
  selector: 'tt-home',
  standalone: true,
  imports: [
    CommonModule,
    TimeTableViewComponentModule,
    MatIconModule,
    MatButtonModule,
    TimeTilesComponent,
    CalendarViewComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
