import {
  calculateWorkDuration,
  durationToDate,
  stringToTime,
  timeToDate,
  timeToMinutes,
} from './time.util';
import {
  differenceInMinutes,
  formatDuration,
  hoursToMinutes,
  minutesInHour,
  minutesToHours,
} from 'date-fns';
import { WorkTime } from '../core/interfaces/work-time';
import { Settings } from '../core/interfaces/settings';

export const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export function calculateAvgWorkTime(items: WorkTime[]) {
  const workingDays = items.filter(({ type }) => type === 'normal');
  const workTimeSum = workingDays.reduce((prev, curr) => {
    const duration = calculateWorkDuration(curr.start, curr.end);
    return prev + hoursToMinutes(duration.hours ?? 0) + (duration.minutes ?? 0);
  }, 0);
  return workTimeSum / workingDays.length / minutesInHour;
}

export function parseAvgWorkTime(avgTime: number): string {
  return avgTime.toPrecision(3) + ' hours';
}

export function calculateVacationDays(
  items: WorkTime[],
  settings: Settings | undefined,
  previousYear: number = new Date().getFullYear() - 1
): {
  total: number;
  taken: number;
  available: number;
} {
  const taken = items.reduce(
    (prev, curr) => (curr.type === 'vacation' ? prev + 1 : prev),
    0
  );
  const remaining =
    settings?.previousYears?.[previousYear]?.remainingVacationDays ?? 0;

  const perYear = settings?.vacationDaysPerYear ?? 25;
  const total = remaining + perYear;

  return { available: total - taken, total, taken };
}

export function calculateOvertime(
  items: WorkTime[],
  settings: Settings | undefined,
  previousYear: number = new Date().getFullYear() - 1
) {
  let overtime = items
    .filter(({ type }) => type === 'normal' || type === 'remote')
    .reduce((prev, curr) => {
      const realWorkTimeInMinutes = differenceInMinutes(
        durationToDate(calculateWorkDuration(curr.start, curr.end)),
        timeToDate(curr.pause)
      );
      let isWorkDay = true;
      if (settings?.workDays) {
        const weekDayIndex =
          curr.date.getDay() === 0 ? 6 : curr.date.getDay() - 1;
        if (!settings.workDays.includes(weekDays[weekDayIndex])) {
          isWorkDay = false;
        }
      } else if (curr.date.getDay() === 0 || curr.date.getDay() === 6) {
        isWorkDay = false;
      }
      if (!isWorkDay) {
        return prev + realWorkTimeInMinutes;
      }

      let minutesPerDay = 8 * minutesInHour;
      if (settings?.workTimePerDay) {
        const { hours, minutes } = stringToTime(settings.workTimePerDay);
        minutesPerDay = hours * minutesInHour + minutes;
      }
      return prev + realWorkTimeInMinutes - minutesPerDay;
    }, 0);
  if (settings?.previousYears?.[previousYear]) {
    overtime += timeToMinutes(
      stringToTime(settings?.previousYears?.[previousYear]?.remainingOvertime)
    );
  }
  return overtime;
}

export function parseOvertime(overtime: Minutes) {
  const isNegativeOvertime = overtime < 0;
  let duration;
  if (!isNegativeOvertime) {
    duration = {
      minutes: overtime % minutesInHour,
      hours: minutesToHours(overtime),
    };
  } else {
    const absOvertime: Minutes = Math.abs(overtime);
    const hourGreaterZero = overtime <= -minutesInHour;
    duration = {
      minutes: hourGreaterZero
        ? absOvertime % minutesInHour
        : overtime % minutesInHour,
      hours: hourGreaterZero ? -minutesToHours(absOvertime) : 0,
    };
  }
  return overtime === 0
    ? '0 hours 0 minutes'
    : formatDuration(duration, { format: ['hours', 'minutes'] });
}

type Minutes = number;
