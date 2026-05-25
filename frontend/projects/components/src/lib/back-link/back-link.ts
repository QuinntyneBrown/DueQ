import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkTarget } from '../models';

@Component({
  selector: 'lib-back-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './back-link.html',
  styleUrl: './back-link.scss',
})
export class BackLink {
  label = input<string>('Back');
  href = input<string | null>(null);
  routerLink = input<LinkTarget>(null);
  testId = input<string | null>(null);
}
