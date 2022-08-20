import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTilesComponent } from './time-tiles.component';

describe('TimeTilesComponent', () => {
  let component: TimeTilesComponent;
  let fixture: ComponentFixture<TimeTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeTilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
