import { Time } from './work-time';
import { weekDays } from '../../utils/work-time.util';

export interface Settings {
  defaultTimes: DefaultTimes;
  workDays: WeekDay[];
  vacationDaysPerYear: number;
  workTimePerDay: Time;
  previousYears: PreviousYears;
}

interface DefaultTimes {
  start: Time;
  end: Time;
  pause: Time;
}

interface PreviousYears {
  [year: number]: {
    remainingOvertime: Time;
    remainingVacationDays: number;
  };
}

type WeekDay = (typeof weekDays)[number];

export const defaultSettings: Settings = {
  defaultTimes: {
    start: {
      hours: 9,
      minutes: 0,
    },
    end: {
      hours: 17,
      minutes: 30,
    },
    pause: {
      hours: 0,
      minutes: 30,
    },
  },
  previousYears: {
    [new Date().getFullYear() - 1]: {
      remainingOvertime: {
        hours: 0,
        minutes: 0,
      },
      remainingVacationDays: 0,
    },
  },
  vacationDaysPerYear: 24,
  workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  workTimePerDay: {
    hours: 8,
    minutes: 0,
  },
};
