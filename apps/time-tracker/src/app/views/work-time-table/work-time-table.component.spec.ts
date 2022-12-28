import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTimeTableComponent } from './work-time-table.component';

describe('OverviewViewComponent', () => {
  let component: WorkTimeTableComponent;
  let fixture: ComponentFixture<WorkTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkTimeTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
