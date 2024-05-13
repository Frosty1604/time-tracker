import { Injectable } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Subject, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginatorService {
  readonly pageSizeKey = 'pageSize';
  readonly pageSizeOptions = [5, 10, 30, 60, 100] as const;

  readonly pageSizeInitial = localStorage.getItem(this.pageSizeKey)
    ? coerceNumberProperty(localStorage.getItem(this.pageSizeKey))
    : this.pageSizeOptions[0];

  private readonly pageEventSubject = new Subject<PageEvent>();

  readonly pageSize$ = this.pageEventSubject.pipe(
    map(({ pageSize }) => pageSize),
    tap((pageSize) => this.savePageSize(pageSize)),
  );

  changePage(pageEvent: PageEvent) {
    this.pageEventSubject.next(pageEvent);
  }

  private savePageSize(pageSize: number) {
    localStorage.setItem(this.pageSizeKey, pageSize.toString());
  }
}
