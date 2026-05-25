import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTileKind } from '../models';

@Component({
  selector: 'lib-icon-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-tile.html',
  styleUrl: './icon-tile.scss',
})
export class IconTile {
  icon = input.required<string>();
  kind = input<IconTileKind>('bill');
  size = input<number>(40);
}
