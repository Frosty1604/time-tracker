import { EntityModel } from './entity.model';
import { Time } from '@angular/common';

export interface WorkTimeModel extends EntityModel {
  date: Date;
  start: Time;
  end: Time;
  duration: Time;
  pause: Time;
  holiday: boolean;
  publicHoliday?: boolean;
}
