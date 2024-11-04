import { Injectable } from '@angular/core';
import { defaultSettings, Settings } from '../interfaces/settings';
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

  get(): Settings {
    const settings = localStorage.getItem(this.key);
    if (!settings) {
      return defaultSettings;
    }
    return JSON.parse(settings);
  }

  upsert(settings: Settings): void {
    const savedSettings = this.get();

    if (savedSettings) {
      settings.previousYears = {
        ...savedSettings.previousYears,
        ...settings.previousYears,
      };
    }

    this.settingsChangedSubject.next(settings);
    localStorage.setItem(this.key, JSON.stringify(settings));
  }
}
