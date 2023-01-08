import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TileDetails {
  value: string | number;
  title: string;
  icon: string;
  tooltip?: string;
  colors?: string[];
}

@Component({
  selector: 'tt-tile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  @Input()
  data$?: Observable<TileDetails>;

  readonly defaultBackground = ['bg-white', 'dark:bg-neutral-700'];
}
