import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { WorkTime, WorkTimeWithID } from '../entities/work-time.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkTimeService {
  private readonly dbService = inject(DatabaseService);
  private readonly storeName = 'work-time';

  find(): Observable<WorkTimeWithID[]> {
    return fromPromise(this.dbService.db.getAll(this.storeName)).pipe(
      map((items) => items as WorkTimeWithID[])
    );
  }

  add(workTime: WorkTime): Promise<number> {
    return this.dbService.db.add(this.storeName, {
      ...workTime,
      created: Date.now(),
      updated: Date.now(),
    });
  }

  update(workTime: WorkTimeWithID): Promise<number> {
    return this.dbService.db.put(this.storeName, {
      ...workTime,
      updated: Date.now(),
    });
  }

  delete(workTimeId: number) {
    return this.dbService.db.delete(this.storeName, workTimeId);
  }
}
