import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-back-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './back-link.html',
  styleUrl: './back-link.scss',
})
export class BackLink {
  label = input<string>('Back');
  href = input<string | null>(null);
}
