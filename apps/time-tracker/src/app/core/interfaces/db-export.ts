import { WorkTime } from './work-time';
import { Settings } from './settings';

export interface DBExport {
  workTimeEntries: WorkTime[];
  dbVersion: number;
  settings: Settings;
}
