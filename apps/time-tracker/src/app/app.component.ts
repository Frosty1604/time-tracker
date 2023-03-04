import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tt-root',
  template: ` <tt-navigation>
    <main class="p-5 sm:p-10">
      <router-outlet></router-outlet>
    </main>
  </tt-navigation>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
