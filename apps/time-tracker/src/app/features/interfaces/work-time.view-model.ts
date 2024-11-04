import {
  Time,
  WorkTimePartial,
  WorkType,
} from '../../core/interfaces/work-time';
import { Duration } from 'date-fns';

export interface WorkTimeViewModel {
  date: Date;
  effectiveTime: Duration;
  startDate: Date;
  endDate: Date;
  pauseTime: Time;
  type: WorkType;
  isWorkDay: boolean;
  entity: WorkTimePartial;
  notes?: string;
}
