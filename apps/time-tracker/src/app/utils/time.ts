import { Time } from '@angular/common';
import { lightFormat } from 'date-fns';

export function timeToDate(time: Time) {
  return new Date(0, 0, 0, time.hours, time.minutes);
}

export function durationToDate({
  days = 0,
  hours = 0,
  minutes = 0,
  months = 0,
  years = 0,
}: Duration) {
  return new Date(years, months, days, hours, minutes);
}

export function timeToTimeString(time: Time) {
  return lightFormat(timeToDate(time), 'HH:mm');
}
