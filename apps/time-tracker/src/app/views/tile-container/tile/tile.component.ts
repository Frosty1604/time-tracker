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
  selector: 'tt-tile',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, NgIf, AsyncPipe, NgClass],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  @Input()
  data$?: Observable<TileDetails>;

  readonly defaultBackground = ['bg-white', 'dark:bg-neutral-700'];
}
