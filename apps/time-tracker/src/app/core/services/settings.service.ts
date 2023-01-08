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
  get(): Settings | undefined {
    const settings = localStorage.getItem(this.key);
    if (!settings) {
      return undefined;
    }
    return JSON.parse(settings);
  }

  upsert(settings: Settings): void {
    this.settingsChangedSubject.next(settings);
    localStorage.setItem(this.key, JSON.stringify(settings));
  }
}
