import { Time } from '@angular/common';
import { WorkTimePartial, WorkType } from '../../core/interfaces/work-time';
import { Duration } from 'date-fns';

export interface WorkTimeViewModel {
  date: Date;
  effectiveTime: Duration;
  startTime: Time;
  endTime: Time;
  pauseTime: Time;
  type: WorkType;
  isWorkDay: boolean;
  entity: WorkTimePartial;
  notes?: string;
}
