import { Injectable } from '@angular/core';
import { Settings } from '../entities/settings.entity';
import { startWith, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly key = 'settings';
  private readonly settingsChangedSubject = new Subject<Settings>();
  readonly settings$ = this.settingsChangedSubject
    .asObservable()
    .pipe(startWith(this.get()));
  private readonly defaultSettings: Settings = {
    defaultTimes: {
      start: '09:00',
      end: '17:30',
      pause: '00:30',
    },
    previousYears: {
      [new Date().getFullYear() - 1]: {
        remainingOvertime: '00:00',
        remainingVacationDays: 0,
      },
    },
    vacationDaysPerYear: 0,
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workTimePerDay: '08:00',
  };
  get(): Settings {
    const settings = localStorage.getItem(this.key);
    if (!settings) {
      return this.defaultSettings;
    }
    return JSON.parse(settings);
  }

  upsert(settings: Settings): void {
    this.settingsChangedSubject.next(settings);
    localStorage.setItem(this.key, JSON.stringify(settings));
  }
}
