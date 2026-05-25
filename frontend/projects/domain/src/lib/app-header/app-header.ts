import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BrandMark } from 'components';

interface RouteMeta {
  readonly title: string;
  readonly showBack: boolean;
  readonly rightAction: { readonly label: string; readonly href: string } | null;
}

const FALLBACK: RouteMeta = { title: 'DueQ', showBack: false, rightAction: null };

const META: Record<string, RouteMeta> = {
  '/dashboard': { title: 'DueQ', showBack: false, rightAction: { label: '⚙', href: '/settings' } },
  '/bills': { title: 'Bills', showBack: false, rightAction: { label: '＋ Add bill', href: '/bills/new' } },
  '/bills/new': { title: 'Add bill', showBack: true, rightAction: { label: 'Cancel', href: '/dashboard' } },
  '/payments/new': { title: 'Record payment', showBack: true, rightAction: { label: 'Cancel', href: '/dashboard' } },
  '/history': { title: 'History', showBack: false, rightAction: null },
  '/settings': { title: 'Settings', showBack: true, rightAction: null },
};

@Component({
  selector: 'lib-app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandMark],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  host: { role: 'banner' },
})
export class AppHeader {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url || '/dashboard' },
  );

  readonly meta = computed<RouteMeta>(() => {
    const url = this.currentUrl().split('?')[0] ?? '';
    if (META[url]) return META[url]!;
    if (url.startsWith('/bills/')) return { title: 'Bill', showBack: true, rightAction: null };
    return FALLBACK;
  });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    interceptLinkClick(event, this.router);
  }

  onBack(event: Event) {
    event.preventDefault();
    history.back();
  }
}

export function interceptLinkClick(event: MouseEvent, router: Router): void {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') || anchor.target === '_blank') return;
  event.preventDefault();
  router.navigateByUrl(href);
}
