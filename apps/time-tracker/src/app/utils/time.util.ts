import {
  Duration,
  hoursToMilliseconds,
  intervalToDuration,
  lightFormat,
  minutesToHours,
  minutesToMilliseconds,
} from 'date-fns';
import {
  millisecondsInHour,
  millisecondsInMinute,
  minutesInHour,
} from 'date-fns/constants';
import { Time } from '../core/interfaces/work-time';

export function timeToDate({ hours, minutes }: Time, baseDate?: Date) {
  if (baseDate) {
    baseDate.setHours(hours);
    baseDate.setMinutes(minutes);
    return baseDate;
  }
  return new Date(hoursToMilliseconds(hours) + minutesToMilliseconds(minutes));
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

export function timeToString(time: Time) {
  return lightFormat(timeToDate(time), 'HH:mm');
}

export function stringToTime(time: string | undefined | null): Time {
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

export const timeToMilliseconds = (time: Time): number =>
  time.minutes * millisecondsInMinute + time.hours * millisecondsInHour;

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
