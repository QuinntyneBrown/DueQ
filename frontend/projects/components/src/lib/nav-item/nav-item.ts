import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.scss',
})
export class NavItem {
  icon = input.required<string>();
  label = input.required<string>();
  href = input<string | null>(null);
  active = input<boolean>(false);
}
