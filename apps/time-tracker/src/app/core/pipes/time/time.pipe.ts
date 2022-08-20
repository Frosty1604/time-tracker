import { Pipe, PipeTransform } from '@angular/core';
import { Duration, formatDuration } from 'date-fns';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: Duration): string {
    return formatDuration(value, { format: ['hours', 'minutes'] });
  }
}
