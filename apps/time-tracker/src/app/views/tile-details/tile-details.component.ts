import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';

export interface TileDetails {
  value: string | number;
  title: string;
  icon: string;
  tooltip?: string;
  colors?: string[];
}

@Component({
  selector: 'tt-tile-details',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, MatTooltipModule, NgClass, NgIf],
  templateUrl: './tile-details.component.html',
  styleUrls: ['./tile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileDetailsComponent {
  @Input()
  data$?: Observable<TileDetails>;

  readonly defaultBackground = ['bg-white', 'dark:bg-neutral-700'];
}
