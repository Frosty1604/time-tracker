import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { WorkTime, WorkTimePartial } from '../entities/work-time.entity';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkTimeService {
  private readonly dbService = inject(DatabaseService);
  private readonly storeName = 'work-time';
  private readonly storeChangedSubject = new Subject<void>();
  readonly storeChange$ = this.storeChangedSubject.asObservable();

  async find(
    query?: number | IDBKeyRange | null | undefined,
    count?: number
  ): Promise<WorkTime[]> {
    const workTimes = await this.dbService.db.getAll(
      this.storeName,
      query,
      count
    );
    return workTimes as WorkTime[];
  }

  async findPaged(
    pageIndex: number,
    pageSize: number,
    sort: 'asc' | 'desc' = 'desc'
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
    const id = this.dbService.db.add(this.storeName, {
      ...workTime,
      created: Date.now(),
      updated: Date.now(),
    });
    this.storeChangedSubject.next();
    return id;
  }

  async update(workTime: WorkTime): Promise<number> {
    const id = await this.dbService.db.put(this.storeName, {
      ...workTime,
      updated: Date.now(),
    });
    this.storeChangedSubject.next();
    return id;
  }

  async delete(workTimeId: number): Promise<number> {
    void this.dbService.db.delete(this.storeName, workTimeId);
    this.storeChangedSubject.next();
    return workTimeId;
  }

  count(): Promise<number> {
    return this.dbService.db.count(this.storeName);
  }
}
