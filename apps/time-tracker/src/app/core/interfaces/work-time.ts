import { Base } from './base';

export interface Time {
  hours: number;
  minutes: number;
}

export interface OldWorkTimePartial extends Base {
  date: Date;
  start: Time;
  end: Time;
  pause: Time;
  type: WorkType;
  notes?: string;
}

export type OldWorkTime = Required<OldWorkTimePartial>;

export interface WorkTimePartial extends Base {
  date: Date;
  start: Date;
  end: Date;
  pause: Time;
  type: WorkType;
  notes?: string;
}

export type WorkTime = Required<WorkTimePartial>;

export const workTypes = ['normal', 'remote', 'vacation', 'sick'] as const;
export type WorkType = (typeof workTypes)[number];
