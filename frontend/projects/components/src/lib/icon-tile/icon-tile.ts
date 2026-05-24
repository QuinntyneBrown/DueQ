import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTileKind } from '../models';

@Component({
  selector: 'lib-icon-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="icon-tile" [class]="'t-' + kind()" [style.--size.px]="size()">{{ icon() }}</span>`,
  styles: `
    :host { display: inline-block; }
    .icon-tile {
      width: var(--size, 40px);
      height: var(--size, 40px);
      border-radius: var(--r-2);
      display: grid;
      place-items: center;
      font-size: calc(var(--size, 40px) * 0.45);
      flex-shrink: 0;
      background: var(--surface-2);
      color: var(--ink);
    }
    .icon-tile.t-bill { background: var(--surface-2); color: var(--ink); }
    .icon-tile.t-payment { background: var(--tint-green); color: var(--owed-to-you); }
    .icon-tile.t-warn { background: var(--tint-red); color: var(--owed-by-you); }
  `,
})
export class IconTile {
  icon = input.required<string>();
  kind = input<IconTileKind>('bill');
  size = input<number>(40);
}
