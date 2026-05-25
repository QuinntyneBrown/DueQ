import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarVariant } from '../models';

@Component({
  selector: 'lib-avatar-large',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-large.html',
  styleUrl: './avatar-large.scss',
})
export class AvatarLarge {
  initials = input.required<string>();
  variant = input<AvatarVariant>('default');
  ariaHidden = input<boolean>(false);
  testId = input<string | null>(null);
}
