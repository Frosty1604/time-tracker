import { Settings } from '../../core/interfaces/settings';
import { WorkTime } from '../../core/interfaces/work-time';

export interface TileViewModel {
  settings: Settings | undefined;
  items: WorkTime[];
}
