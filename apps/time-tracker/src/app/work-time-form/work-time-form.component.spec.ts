import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTimeFormComponent } from './work-time-form.component';

describe('WorkTimeFormComponent', () => {
  let component: WorkTimeFormComponent;
  let fixture: ComponentFixture<WorkTimeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkTimeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkTimeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
