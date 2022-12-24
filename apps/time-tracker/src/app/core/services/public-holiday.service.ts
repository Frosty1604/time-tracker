import { Injectable } from '@angular/core';
import { isHoliday, setState, StateCode } from 'holiday-de';

@Injectable({
  providedIn: 'root',
})
export class PublicHolidayService {
  isPublicHoliday(date: Date): string | false {
    return isHoliday(date);
  }

  setState(stateCode: StateCode) {
    setState(stateCode);
  }
}
