import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TileContainerComponent } from '../views/tile-container/tile-container.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { WorkTimeTableComponent } from '../views/work-time-table/work-time-table.component';

@Component({
  selector: 'tt-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TileContainerComponent,
    CalendarComponent,
    WorkTimeTableComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
