import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileDetailsComponent } from './tile-details.component';

describe('TileDetailsComponent', () => {
  let component: TileDetailsComponent;
  let fixture: ComponentFixture<TileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
