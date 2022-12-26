import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tt-tile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  @Input()
  data$?: Observable<{
    value: string | number;
    title: string;
    icon: string;
    colors?: string[];
  }>;

  readonly defaultBackground = ['bg-white', 'dark:bg-neutral-700'];
}
