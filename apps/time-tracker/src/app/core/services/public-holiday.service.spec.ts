import { TestBed } from '@angular/core/testing';

import { PublicHolidayService } from './public-holiday.service';

describe('PublicHolidayService', () => {
  let service: PublicHolidayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicHolidayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
