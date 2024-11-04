import { Injectable, isDevMode } from '@angular/core';
import {
  DBSchema,
  IDBPDatabase,
  IDBPObjectStore,
  openDB,
  StoreNames,
} from 'idb';
import {
  OldWorkTimePartial,
  Time,
  WorkTimePartial,
} from '../interfaces/work-time';
import { Settings } from '../interfaces/settings';
import { stringToTime } from '../../utils/time.util';

interface TimeTrackerDB extends DBSchema {
  'work-time': {
    key: number;
    value: WorkTimePartial;
    indexes: {
      'by-day': 'date';
    };
  };
}

const name = 'timeTrackerDb';
export const DB_VERSION = 2;

async function create(): Promise<IDBPDatabase<TimeTrackerDB>> {
  return openDB<TimeTrackerDB>(name, DB_VERSION, {
    async upgrade(db, oldVersion, newVersion, transaction) {
      debugger;
      switch (oldVersion) {
        case 0: {
          const workTimeStore = db.createObjectStore('work-time', {
            keyPath: 'id',
            autoIncrement: true,
          });
          workTimeStore.createIndex('by-day', 'date', { unique: false });
          break;
        }
        case 1: {
          const workTimeStore = transaction.store as unknown as IDBPObjectStore<
            TimeTrackerDB,
            ArrayLike<StoreNames<TimeTrackerDB>>,
            StoreNames<TimeTrackerDB>,
            'versionchange'
          >;
          const allEntries = await workTimeStore.getAll();
          debugger;
          for (const entry of allEntries) {
            entry.start = convertTimeToDate(
              (entry as unknown as OldWorkTimePartial).start,
              entry.date,
            );
            entry.end = convertTimeToDate(
              (entry as unknown as OldWorkTimePartial).end,
              entry.date,
            );
            workTimeStore.put(entry);
          }

          let settings: string | Settings | null =
            localStorage.getItem('settings');
          if (settings) {
            try {
              settings = JSON.parse(settings) as Settings;
              debugger;
              settings.defaultTimes.start = stringToTime(
                settings.defaultTimes.start as unknown as string,
              );
              settings.defaultTimes.end = stringToTime(
                settings.defaultTimes.end as unknown as string,
              );
              settings.defaultTimes.pause = stringToTime(
                settings.defaultTimes.pause as unknown as string,
              );

              settings.workTimePerDay = stringToTime(
                settings.workTimePerDay as unknown as string,
              );

              for (const [year, entry] of Object.entries(
                settings?.previousYears,
              )) {
                settings.previousYears[Number(year)].remainingOvertime =
                  stringToTime(entry.remainingOvertime as unknown as string);
              }
            } catch (e) {
              console.error(e);
            }
          }
          debugger;
          localStorage.setItem('settings', JSON.stringify(settings));
          break;
        }
      }
      return transaction.done;
    },
  });
}

const convertTimeToDate = (time: Time, date: Date): Date =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.hours,
    time.minutes,
  );

let initState: null | Promise<IDBPDatabase<TimeTrackerDB>> = null;
let DB_INSTANCE: IDBPDatabase<TimeTrackerDB>;

export async function initDB() {
  if (!initState) {
    if (isDevMode()) {
      console.log('initialize DB...');
    }
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
