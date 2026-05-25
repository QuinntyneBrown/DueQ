import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Avatar, BrandMark, NavLink } from 'components';
import { SETTINGS_SERVICE } from 'api';
import { interceptLinkClick } from '../app-header/app-header';
import { toInitials } from '../utils/initials';

const NAV = [
  { icon: '⌂', label: 'Dashboard', href: '/dashboard' },
  { icon: '▤', label: 'Bills', href: '/bills' },
  { icon: '↻', label: 'History', href: '/history' },
  { icon: '＋', label: 'Add bill', href: '/bills/new' },
  { icon: '↓', label: 'Record payment', href: '/payments/new' },
  { icon: '◔', label: 'Settings', href: '/settings' },
] as const;

@Component({
  selector: 'lib-app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, BrandMark, NavLink],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.scss',
  host: { role: 'complementary' },
})
export class AppSidebar {
  private readonly router = inject(Router);
  private readonly settings = inject(SETTINGS_SERVICE);

  readonly nav = NAV;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url || '/dashboard' },
  );

  private readonly profile = toSignal(this.settings.get(), {
    initialValue: { yourName: '', partnerName: '' },
  });

  readonly yourName = computed(() => this.profile().yourName || 'You');
  readonly initials = computed(() => toInitials(this.profile().yourName) || 'Y');

  isActive(href: string): boolean {
    const url = this.currentUrl().split('?')[0] ?? '';
    if (href === '/dashboard') return url === '/' || url === '' || url.startsWith('/dashboard');
    return url === href || url.startsWith(href + '/');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    interceptLinkClick(event, this.router);
  }
}
