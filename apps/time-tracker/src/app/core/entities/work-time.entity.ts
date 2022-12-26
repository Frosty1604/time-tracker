import { BaseEntity } from './base.entity';
import { Time } from '@angular/common';

export interface WorkTime extends BaseEntity {
  date: Date;
  start: Time;
  end: Time;
  pause: Time;
  type: WorkType;
}

export type WorkTimeWithID = Required<WorkTime>;

export type WorkType = 'normal' | 'vacation' | 'sick';
