import { Time } from '@angular/common';
import { lightFormat } from 'date-fns';

export function timeToDate(time: Time) {
  return new Date(0, 0, 0, time.hours, time.minutes);
}

export function durationToTime(time: Time) {
  return lightFormat(timeToDate(time), 'HH:mm');
}
