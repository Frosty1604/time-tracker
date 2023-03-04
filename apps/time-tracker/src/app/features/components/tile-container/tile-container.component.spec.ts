import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileContainerComponent } from './tile-container.component';

describe('TileContainerComponent', () => {
  let component: TileContainerComponent;
  let fixture: ComponentFixture<TileContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
