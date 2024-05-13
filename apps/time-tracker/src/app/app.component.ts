import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './features/components/navigation/navigation.component';

@Component({
  selector: 'tt-root',
  standalone: true,
  template: ` <tt-navigation>
    <main class="p-5 sm:p-10">
      <router-outlet></router-outlet>
    </main>
  </tt-navigation>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavigationComponent],
})
export class AppComponent {}
