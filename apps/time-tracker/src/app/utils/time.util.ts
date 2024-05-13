import { Time } from '@angular/common';
import {
  Duration,
  hoursToMilliseconds,
  intervalToDuration,
  lightFormat,
  minutesToHours,
  minutesToMilliseconds,
} from 'date-fns';
import { minutesInHour } from 'date-fns/constants';

export function timeToDate({ hours, minutes }: Time) {
  return new Date(hoursToMilliseconds(hours) + minutesToMilliseconds(minutes));
}

export function durationToDate({
  days = 0,
  hours = 0,
  minutes = 0,
  months = 0,
  years = 0,
}: Duration) {
  const date = new Date(0);
  date.setFullYear(
    date.getFullYear() + years,
    date.getMonth() + months,
    date.getDate() + days,
  );
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

export function timeToString(time: Time) {
  return lightFormat(timeToDate(time), 'HH:mm');
}

export function stringToTime(time: string): Time {
  if (!time || time === '') {
    throw new Error();
  }
  const [hours, minutes] = time.split(':');
  return { hours: Number(hours), minutes: Number(minutes) };
}

export function minutesToTime(minutes: number): Time {
  if (!minutes && minutes !== 0) {
    throw new Error();
  }
  return { hours: minutesToHours(minutes), minutes: minutes % minutesInHour };
}

export function timeToMinutes(time: Time): number {
  if (!time) {
    throw new Error();
  }
  return time.minutes + time.hours * minutesInHour;
}

export function calculateWorkDuration(
  start: Time | string,
  end: Time | string,
): Time {
  if (typeof start === 'string') {
    start = stringToTime(start);
  }
  if (typeof end === 'string') {
    end = stringToTime(end);
  }

  const duration = intervalToDuration({
    start: timeToDate(start),
    end: timeToDate(end),
  });
  return {
    hours: duration.hours ?? 0,
    minutes: duration.minutes ?? 0,
  };
}
