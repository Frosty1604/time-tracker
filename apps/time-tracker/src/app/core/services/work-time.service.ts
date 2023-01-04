import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { WorkTime, WorkTimePartial } from '../entities/work-time.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkTimeService {
  private readonly dbService = inject(DatabaseService);
  private readonly storeName = 'work-time';

  find(
    query?: number | IDBKeyRange | null | undefined,
    count?: number
  ): Observable<WorkTime[]> {
    return fromPromise(
      this.dbService.db.getAll(this.storeName, query, count)
    ).pipe(map((items) => items as WorkTime[]));
  }

  async findPaged(pageIndex: number, pageSize: number): Promise<WorkTime[]> {
    const tx = this.dbService.db.transaction(this.storeName);
    let cursor = await tx.store.index('by-day').openCursor();
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

  insert(workTime: WorkTimePartial): Promise<number> {
    return this.dbService.db.add(this.storeName, {
      ...workTime,
      created: Date.now(),
      updated: Date.now(),
    });
  }

  update(workTime: WorkTime): Promise<number> {
    return this.dbService.db.put(this.storeName, {
      ...workTime,
      updated: Date.now(),
    });
  }

  async delete(workTimeId: number): Promise<number> {
    void this.dbService.db.delete(this.storeName, workTimeId);
    return workTimeId;
  }

  count(): Promise<number> {
    return this.dbService.db.count(this.storeName);
  }
}
