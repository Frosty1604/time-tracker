import { BaseEntity } from './base.entity';
import { Time } from '@angular/common';

export interface WorkTimePartial extends BaseEntity {
  date: Date;
  start: Time;
  end: Time;
  pause: Time;
  type: WorkType;
  notes?: string | undefined;
}

export type WorkTime = Required<WorkTimePartial>;

export type WorkType = 'normal' | 'vacation' | 'sick';
