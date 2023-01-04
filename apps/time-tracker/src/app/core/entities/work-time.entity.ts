import { BaseEntity } from './base.entity';
import { Time } from '@angular/common';

export interface WorkTimePartial extends BaseEntity {
  date: Date;
  start: Time;
  end: Time;
  pause: Time;
  type: WorkType;
}

export type WorkTime = Required<WorkTimePartial>;

export type WorkType = 'normal' | 'vacation' | 'sick';
