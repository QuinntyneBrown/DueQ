import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { FloatingActionButton, NavItem } from 'components';
import { interceptLinkClick } from '../app-header/app-header';

const ITEMS = [
  { icon: '⌂', label: 'Home', href: '/dashboard' },
  { icon: '▤', label: 'Bills', href: '/bills' },
  { icon: '↻', label: 'History', href: '/history' },
  { icon: '◔', label: 'You', href: '/settings' },
] as const;

@Component({
  selector: 'lib-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FloatingActionButton, NavItem],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
  host: {
    role: 'navigation',
    'aria-label': 'Primary',
  },
})
export class BottomNav {
  private readonly router = inject(Router);

  readonly items = ITEMS;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url || '/dashboard' },
  );

  readonly active = computed(() => this.currentUrl().split('?')[0] ?? '');

  isActive(href: string): boolean {
    const url = this.active();
    if (href === '/dashboard') return url === '/' || url === '' || url.startsWith('/dashboard');
    return url === href || url.startsWith(href + '/');
  }

  onAddBill() {
    this.router.navigateByUrl('/bills/new');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    interceptLinkClick(event, this.router);
  }
}
