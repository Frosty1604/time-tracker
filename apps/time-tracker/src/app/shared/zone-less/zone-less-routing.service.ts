import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZoneLessRoutingService implements OnDestroy {
  private ngDestroySubject = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly ngZone: NgZone
  ) {}

  init() {
    if (!isZonePresent()) {
      this.router.events.pipe(
        takeUntil(this.ngDestroySubject),
        filter((e) => e instanceof NavigationEnd),
        tap(() => this.ngZone.onMicrotaskEmpty.next(true))
      );
    }
  }

  ngOnDestroy(): void {
    this.ngDestroySubject.next();
  }
}

function isZonePresent(): boolean {
  return !!(window as any).Zone;
}
