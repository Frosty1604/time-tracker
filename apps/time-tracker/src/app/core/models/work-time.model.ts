import { EntityModel } from './entity.model';
import { Time } from '@angular/common';

export interface WorkTimeModel extends EntityModel {
  date: Date;
  start: Time;
  end: Time;
  duration: Duration;
  pause: Time;
  holiday: boolean;
}
