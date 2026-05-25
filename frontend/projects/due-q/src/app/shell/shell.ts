import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, filter, of } from 'rxjs';
import { ISettingsService, SETTINGS_SERVICE, Settings } from 'api';
import { Avatar, BrandMark, FloatingActionButton, NavItem, NavLink } from 'components';

export interface HeaderConfig {
  readonly title: string;
  readonly action: HeaderAction | null;
}

export type HeaderAction =
  | { readonly kind: 'gear'; readonly route: string }
  | { readonly kind: 'add-bill'; readonly route: string }
  | { readonly kind: 'cancel'; readonly route: string }
  | { readonly kind: 'skip'; readonly route: string };

const DEFAULT_HEADER: HeaderConfig = { title: 'DueQ', action: null };
const EMPTY_SETTINGS: Settings = { yourName: '', partnerName: '' };

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, Avatar, BrandMark, FloatingActionButton, NavItem, NavLink],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly router = inject(Router);
  private readonly settings = inject<ISettingsService>(SETTINGS_SERVICE);

  protected readonly header = signal<HeaderConfig>(this.readHeaderFromRouterState());

  protected readonly title = computed(() => this.header().title);
  protected readonly action = computed(() => this.header().action);

  private readonly profile = toSignal(
    (this.settings.get() as Observable<Settings>).pipe(
      catchError(() => of(EMPTY_SETTINGS)),
    ),
    { initialValue: EMPTY_SETTINGS },
  );

  protected readonly yourName = computed(() => (this.profile()?.yourName ?? '') || 'You');
  protected readonly yourInitials = computed(() => toInitials(this.profile()?.yourName ?? ''));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.header.set(this.readHeaderFromRouterState()));
  }

  private readHeaderFromRouterState(): HeaderConfig {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const data = route.data['header'] as HeaderConfig | undefined;
    return data ?? DEFAULT_HEADER;
  }
}

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Y';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
