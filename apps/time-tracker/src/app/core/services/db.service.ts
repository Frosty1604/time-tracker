import { Injectable } from '@angular/core';
import { Observable, share, Subject, switchMap, withLatestFrom } from 'rxjs';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { WorkTimeModel } from '../models/work-time.model';

export interface TimeTrackerDBSchema extends DBSchema {
  dayEntry: {
    key: string;
    value: WorkTimeModel;
    indexes: {
      'by-day': Date;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  version = 1;
  databaseName = 'time-tracker-idb';

  private readonly dbConnection$: Observable<
    IDBPDatabase<TimeTrackerDBSchema>
  > = fromPromise(
    openDB<TimeTrackerDBSchema>(this.databaseName, this.version, {
      upgrade(db) {
        console.log('IndexedDB upgrade');
        db.createObjectStore('dayEntry', {
          keyPath: 'id',
          autoIncrement: true,
        });
      },
    })
  ).pipe(share());

  private addItemSubject = new Subject<WorkTimeModel>();
  addedItem$: Observable<WorkTimeModel> = this.addItemSubject
    .asObservable()
    .pipe(
      withLatestFrom(this.dbConnection$),
      switchMap(async ([workTime, db]) => {
        const tx = db.transaction('dayEntry', 'readwrite');
        workTime.id = await tx.objectStore('dayEntry').add(workTime);
        return workTime;
      })
    );

  private deleteItemSubject = new Subject<string>();
  deletedItem$: Observable<string> = this.deleteItemSubject.asObservable().pipe(
    withLatestFrom(this.dbConnection$),
    switchMap(async ([key, db]) => {
      const tx = db.transaction('dayEntry', 'readwrite');
      const store = tx.objectStore('dayEntry');
      await store.delete(key);
      return key;
    })
  );

  private updateItemSubject = new Subject<WorkTimeModel>();
  updatedItem$: Observable<string> = this.updateItemSubject.asObservable().pipe(
    withLatestFrom(this.dbConnection$),
    switchMap(async ([value, db]) => {
      const tx = db.transaction('dayEntry', 'readwrite');
      return tx.objectStore('dayEntry').put(value);
    })
  );

  getItem(name: 'dayEntry', query: string | IDBKeyRange) {
    return this.dbConnection$.pipe(
      switchMap((db) => {
        const tx = db.transaction(name, 'readwrite');
        return tx.objectStore(name).get(query);
      })
    );
  }

  addItem(value: WorkTimeModel): void {
    this.addItemSubject.next(value);
  }

  updateItem(workTimeModel: WorkTimeModel) {
    this.updateItemSubject.next(workTimeModel);
  }

  getAllData(name: 'dayEntry'): Observable<WorkTimeModel[]> {
    return this.dbConnection$.pipe(
      switchMap((db) => {
        const tx = db.transaction(name, 'readonly');
        return tx.objectStore(name).getAll();
      })
    );
  }

  deleteItem(key: string): void {
    this.deleteItemSubject.next(key);
  }

  /*addItems<T>(target: TimeTrackerDBKeys, value: T[]): Observable<T[]> {
    return this.dbConnection$.pipe(
      map((db) => {
        const tx = db.transaction(target, 'readwrite');
        value.map((v) => tx.objectStore(target).add({ ...v }));
        return value;
      })
    );
  }

  deleteItems(
    target: TimeTrackerDBKeys,
    value: (string | number)[]
  ): Observable<(string | number)[]> {
    return this.dbConnection$.pipe(
      map((db) => {
        const tx = db.transaction(target, 'readwrite');
        const store = tx.objectStore(target);
        value.map((v) => store.delete(v));
        return value;
      })
    );
  }



  deleteDB() {
    deleteDB(this.databaseName, {
      blocked() {
        console.log('deleteDB blocked');
      },
    });
  }

  checkOfflineReady<T>(): Observable<T[]> {
    return this.dbConnection$.pipe(
      switchMap((db) => {
        const tx = db.transaction('Status', 'readonly');
        const store = tx.objectStore('Status');
        return from(store.getAll('concrete-record-sheets'));
      })
    );
  }*/
}
