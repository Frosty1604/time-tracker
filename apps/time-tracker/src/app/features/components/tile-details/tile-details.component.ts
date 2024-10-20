import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, NgClass } from '@angular/common';
import { Tile } from '../../interfaces/tile';

@Component({
  selector: 'tt-tile-details',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, MatTooltipModule, NgClass],
  templateUrl: './tile-details.component.html',
  styleUrls: ['./tile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileDetailsComponent {
  tileDetails = input.required<Tile>();

  readonly defaultBackground = ['bg-white', 'dark:bg-neutral-700'];
}
