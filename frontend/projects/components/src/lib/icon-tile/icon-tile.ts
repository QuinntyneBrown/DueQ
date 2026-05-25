import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconTileKindValue, normalizeIconTileKind } from '../models';

@Component({
  selector: 'lib-icon-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-tile.html',
  styleUrl: './icon-tile.scss',
})
export class IconTile {
  icon = input.required<string>();
  kind = input<IconTileKindValue>('bill');
  size = input<number>(40);
  testId = input<string | null>(null);

  kindClass = computed(() => `t-${normalizeIconTileKind(this.kind())}`);
}
