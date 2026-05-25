import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LinkTarget } from '../models';

@Component({
  selector: 'lib-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.scss',
})
export class NavItem {
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
