import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { WorkTime, WorkTimePartial } from '../interfaces/work-time';
import { from, merge, Observable, scan, Subject, tap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

type Action = ActionInsert | ActionUpdate | ActionDelete;

interface ActionInsert {
  action: 'insert';
  workTime: WorkTime;
}

interface ActionUpdate {
  action: 'update';
  workTime: WorkTime;
}

interface ActionDelete {
  action: 'delete';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class WorkTimeService {
  private readonly dbService = inject(DatabaseService);
  private readonly storeName = 'work-time';

  private readonly insertSubject = new Subject<ActionInsert>();
  private readonly updateSubject = new Subject<ActionUpdate>();
  private readonly deleteSubject = new Subject<ActionDelete>();

  readonly storeChange$ = merge(
    this.insertSubject,
    this.updateSubject,
    this.deleteSubject,
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  readonly store$: Observable<WorkTime[]> = merge(
    this.storeChange$.pipe(tap((value) => console.log('storeChange', value))),
    from(this.find()).pipe(tap((value) => console.log('find', value))),
  ).pipe(
    scan<WorkTime[] | Action, Map<number, WorkTime>>((acc, value) => {
      if (Array.isArray(value)) {
        value.forEach((item) => acc.set(item.id, item));
        return acc;
      }
      if (value.action === 'insert' || value.action === 'update') {
        acc.set(value.workTime.id, value.workTime);
      } else if (value.action === 'delete') {
        acc.delete(value.id);
      }
      return acc;
    }, new Map<number, WorkTime>()),
    map((map) => Array.from(map.values())),
    map((workTimeItems) =>
      workTimeItems.sort((a, b) => b.date.getTime() - a.date.getTime()),
    ),
  );

  async find(
    query?: number | IDBKeyRange | null | undefined,
    count?: number,
  ): Promise<WorkTime[]> {
    const workTimes = await this.dbService.db.getAll(
      this.storeName,
      query,
      count,
    );
    return workTimes as WorkTime[];
  }

  async findPaged(
    pageIndex: number,
    pageSize: number,
    sort: 'asc' | 'desc' = 'desc',
  ): Promise<WorkTime[]> {
    const tx = this.dbService.db.transaction(this.storeName);

    let cursor = await tx.store
      .index('by-day')
      .openCursor(null, sort === 'desc' ? 'prev' : 'next');

    let advanced = false;
    let count = 0;

    const skip = pageIndex * pageSize;
    const length = await tx.store.count();
    const result: WorkTime[] = [];
    if (skip >= length) {
      return [];
    }

    while (cursor) {
      if (!advanced && skip > 0) {
        await cursor.advance(skip);
        advanced = true;
      }
      if (count < pageSize) {
        result.push(cursor.value as WorkTime);
      }
      cursor = await cursor.continue();
      count++;
    }
    return result;
  }

  async insert(workTime: WorkTimePartial): Promise<number> {
    const now = Date.now();
    const newWorkTime: WorkTimePartial = {
      ...workTime,
      created: now,
      updated: now,
    };
    newWorkTime.id = await this.dbService.db.add(this.storeName, newWorkTime);

    this.insertSubject.next({
      action: 'insert',
      workTime: newWorkTime as WorkTime,
    });
    return newWorkTime.id;
  }

  async update(workTime: WorkTime): Promise<number> {
    const id = await this.dbService.db.put(this.storeName, {
      ...workTime,
      updated: Date.now(),
    });
    this.updateSubject.next({
      action: 'update',
      workTime,
    });
    return id;
  }

  async delete(workTimeId: number): Promise<number> {
    await this.dbService.db.delete(this.storeName, workTimeId);
    this.deleteSubject.next({ action: 'delete', id: workTimeId });
    return workTimeId;
  }

  count(): Promise<number> {
    return this.dbService.db.count(this.storeName);
  }

  count$(): Observable<number> {
    return merge(
      this.insertSubject.pipe(map(() => 1)),
      this.deleteSubject.pipe(map(() => -1)),
      from(this.count()),
    ).pipe(scan((acc, val) => acc + val));
  }
}
