import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'tt-empty-table-placeholder',
  templateUrl: 'empty-table-placeholder.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, NgOptimizedImage],
  host: {
    class: 'h-96 flex flex-col items-center justify-center gap-4',
  },
})
export class EmptyTablePlaceholderComponent {
  @Output()
  action = new EventEmitter<void>();
}
