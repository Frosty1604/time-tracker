import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { WorkTime } from '../entities/work-time.entity';

interface TimeTrackerDB extends DBSchema {
  'work-time': {
    key: number;
    value: WorkTime;
  };
}

const name = 'timeTrackerDb';
const version = 1;

async function create(): Promise<IDBPDatabase<TimeTrackerDB>> {
  return openDB<TimeTrackerDB>(name, version, {
    upgrade(db) {
      db.createObjectStore('work-time', {
        keyPath: 'id',
        autoIncrement: true,
      });
    },
  });
}

let initState: null | Promise<IDBPDatabase<TimeTrackerDB>> = null;
let DB_INSTANCE: IDBPDatabase<TimeTrackerDB>;

export async function initDB() {
  if (!initState) {
    console.log('initDB()');
    initState = create().then((db) => (DB_INSTANCE = db));
  }
  await initState;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  get db(): IDBPDatabase<TimeTrackerDB> {
    return DB_INSTANCE;
  }
}
