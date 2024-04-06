import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'tt-empty-table-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, NgOptimizedImage],
  template: ` <div class="h-40 w-40 relative">
      <img alt="Empty table" fill ngSrc="assets/img/no_data.svg" priority />
    </div>
    <p>Nothing tracked yet.</p>
    <p>Start by adding your first working time</p>
    <button (click)="action.emit()" color="primary" mat-raised-button>
      <mat-icon>add</mat-icon>
      Add
    </button>`,
  host: {
    class: 'h-96 flex flex-col items-center justify-center gap-4',
  },
})
export class EmptyTablePlaceholderComponent {
  action = output<void>();
}
