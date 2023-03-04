import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';

@Component({ selector: 'tt-navigation', template: '' })
class NavigationComponent {}

// eslint-disable-next-line @angular-eslint/component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavigationComponent,
        RouterOutletStubComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
