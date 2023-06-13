import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { WorkType, workTypes } from '../../core/entities/work-time.entity';
import { NgForOf, TitleCasePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tt-work-type-filter',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    NgForOf,
    TitleCasePipe,
    MatCheckboxModule,
    FormsModule,
  ],
  templateUrl: './work-type-filter.component.html',
  styleUrls: ['./work-type-filter.component.scss'],
})
export class WorkTypeFilterComponent {
  workTypes = workTypes;

  checkedWorkTypes: Record<WorkType, boolean> = {
    normal: true,
    vacation: true,
    sick: true,
    remote: true,
  };
}
