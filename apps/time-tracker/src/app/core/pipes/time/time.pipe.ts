import { Pipe, PipeTransform } from '@angular/core';
import { Duration, formatDuration } from 'date-fns';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: Duration, format: 'short' | 'full' = 'full'): string {
    if (format === 'short') {
      return `${value.hours}:${value.minutes}`;
    }
    return formatDuration(value, { format: ['hours', 'minutes'] });
  }
}
