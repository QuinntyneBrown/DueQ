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
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

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

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly router = inject(Router);

  protected readonly header = signal<HeaderConfig>(this.readHeaderFromRouterState());

  protected readonly title = computed(() => this.header().title);
  protected readonly action = computed(() => this.header().action);

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
