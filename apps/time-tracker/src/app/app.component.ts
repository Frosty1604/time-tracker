import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tt-root',
  template: `<tt-navigation></tt-navigation>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
