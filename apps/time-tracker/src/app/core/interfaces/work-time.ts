import { Base } from './base';
import { Time } from '@angular/common';

export interface WorkTimePartial extends Base {
  date: Date;
  start: Time;
  end: Time;
  pause: Time;
  type: WorkType;
  notes?: string;
}

export type WorkTime = Required<WorkTimePartial>;

export const workTypes = ['normal', 'remote', 'vacation', 'sick'] as const;
export type WorkType = (typeof workTypes)[number];
