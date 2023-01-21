import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Observable, startWith, Subject, tap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tt-theme-toggle',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, AsyncPipe, NgIf],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  private readonly toggleSubject = new Subject<void>();
  readonly showDarkTheme$: Observable<boolean> = this.toggleSubject
    .asObservable()
    .pipe(
      tap(() => {
        this.toggleMode();
      }),
      startWith(this.getTheme()),
      map(() => this.renderTheme()),
      map((theme) => theme === 'dark')
    );

  toggleTheme() {
    this.toggleSubject.next();
  }

  private renderTheme(theme = this.getTheme()): 'dark' | 'light' {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return theme;
  }

  private getTheme(): 'dark' | 'light' {
    const isDarkTheme =
      localStorage['theme'] === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    return isDarkTheme ? 'dark' : 'light';
  }

  private toggleMode(): void {
    localStorage['theme'] =
      localStorage['theme'] === 'light' ? 'dark' : 'light';
  }
}
