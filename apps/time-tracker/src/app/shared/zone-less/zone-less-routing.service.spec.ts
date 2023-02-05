import { TestBed } from '@angular/core/testing';

import { ZoneLessRoutingService } from './zone-less-routing.service';

describe('ZoneLessRoutingService', () => {
  let service: ZoneLessRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneLessRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
