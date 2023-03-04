export interface Settings {
  defaultTimes: DefaultTimes;
  workDays: string[];
  vacationDaysPerYear: number;
  workTimePerDay: string;
  previousYears: PreviousYear;
}

interface DefaultTimes {
  start: string;
  end: string;
  pause: string;
}

interface PreviousYear {
  [year: number]: {
    remainingOvertime: string;
    remainingVacationDays: number;
  };
}
