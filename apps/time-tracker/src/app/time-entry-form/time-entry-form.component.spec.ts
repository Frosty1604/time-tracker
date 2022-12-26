import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEntryFormComponent } from './time-entry-form.component';

describe('TimeEntryFormComponent', () => {
  let component: TimeEntryFormComponent;
  let fixture: ComponentFixture<TimeEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeEntryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
