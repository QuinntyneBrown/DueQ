import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LinkTarget } from '../models';

@Component({
  selector: 'lib-nav-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-link.html',
  styleUrl: './nav-link.scss',
})
export class NavLink {
  icon = input.required<string>();
  label = input.required<string>();
  href = input<string | null>(null);
  routerLink = input<LinkTarget>(null);
  active = input<boolean>(false);
  exact = input<boolean>(false);
  ariaLabel = input<string | null>(null);
  ariaCurrentWhenActive = input<'page' | 'step' | 'location' | 'date' | 'time' | true | false>('page');
  testId = input<string | null>(null);
}
