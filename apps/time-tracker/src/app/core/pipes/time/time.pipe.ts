import { Pipe, PipeTransform } from '@angular/core';
import { Duration, formatDuration } from 'date-fns';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(
    value: Duration,
    format: 'short' | 'medium' | 'full' = 'full'
  ): string {
    if (format === 'short' || format === 'medium') {
      const minutes = ('0' + value.minutes).slice(-2);
      const hours = ('0' + value.hours).slice(-2);

      return format === 'short'
        ? `${hours}:${minutes}`
        : `${hours}h ${minutes}m`;
    }
    return formatDuration(value, { format: ['hours', 'minutes'] });
  }
}
