import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-nav-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-link.html',
  styleUrl: './nav-link.scss',
})
export class NavLink {
  icon = input.required<string>();
  label = input.required<string>();
  href = input<string | null>(null);
  active = input<boolean>(false);
}
