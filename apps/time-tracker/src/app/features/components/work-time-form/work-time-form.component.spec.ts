import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkTimeFormComponent } from './work-time-form.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enGB } from 'date-fns/locale';
import { MatInputModule } from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DatabaseService } from '../../../core/services/database.service';
import { WorkTimeService } from '../../../core/services/work-time.service';

describe('WorkTimeFormComponent', () => {
  let component: WorkTimeFormComponent;
  let fixture: ComponentFixture<WorkTimeFormComponent>;

  const mockDialogRef = {
    close: jest.fn(),
  };

  // Mocking WorkTimeService
  const mockWorkTimeService = {
    insert: jest.fn().mockResolvedValue('123'),
    update: jest.fn().mockResolvedValue({}),
  };

  const mockDBService = {
    db: {
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WorkTimeFormComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DATE_LOCALE,
          useValue: enGB,
        },
        {
          provide: DatabaseService,
          useValue: mockDBService,
        },
        { provide: WorkTimeService, useValue: mockWorkTimeService },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
        provideAnimations(),
        provideDateFnsAdapter(),
      ],
      imports: [
        MatDialogModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDatepickerModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTimeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill out the form and call the insert method', () => {
    const date = new Date();
    component.formGroup.controls.date.setValue(date);
    component.formGroup.controls.start.setValue('09:00');
    component.formGroup.controls.end.setValue('17:00');
    component.formGroup.controls.pause.setValue('01:00');
    component.formGroup.controls.type.setValue('normal');
    component.formGroup.controls.notes.setValue('Some notes');

    component.submit();

    expect(mockWorkTimeService.insert).toHaveBeenCalledWith({
      start: {
        minutes: 0,
        hours: 9,
      },
      end: {
        minutes: 0,
        hours: 17,
      },
      pause: {
        minutes: 0,
        hours: 1,
      },
      date: date,
      type: 'normal',
      notes: 'Some notes',
    });
  });

  it('should close the dialog on submit', () => {
    component.submit();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
