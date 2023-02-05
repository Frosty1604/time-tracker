import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZoneLessRoutingService } from './shared/zone-less/zone-less-routing.service';

@Component({
  selector: 'tt-root',
  template: `<tt-navigation></tt-navigation>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private readonly zoneLessRoutingService: ZoneLessRoutingService) {
    zoneLessRoutingService.init();
  }
}
