import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import {
  CalendarCommonModule,
  CalendarDateFormatter,
  DateAdapter,
} from 'angular-calendar';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent, CalendarCommonModule],
      providers: [
        {
          provide: CalendarDateFormatter,
          useValue: {},
        },
        {
          provide: DateAdapter,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
