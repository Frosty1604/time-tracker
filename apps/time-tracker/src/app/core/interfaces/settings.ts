export interface Settings {
  defaultTimes: DefaultTimes;
  workDays: string[];
  vacationDaysPerYear: number;
  workTimePerDay: string;
  previousYears: PreviousYears;
}

interface DefaultTimes {
  start: string;
  end: string;
  pause: string;
}

interface PreviousYears {
  [year: number]: {
    remainingOvertime: string;
    remainingVacationDays: number;
  };
}
