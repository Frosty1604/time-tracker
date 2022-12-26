import { TestBed } from '@angular/core/testing';

import { WorkTimeService } from './work-time.service';

describe('WorkTimeService', () => {
  let service: WorkTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
