import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFormComponent } from './settings-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsFormComponent', () => {
  let component: SettingsFormComponent;
  let fixture: ComponentFixture<SettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsFormComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
