import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarLarge } from '../avatar-large/avatar-large';
import { AvatarVariant } from '../models';

@Component({
  selector: 'lib-person-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarLarge],
  templateUrl: './person-card.html',
  styleUrl: './person-card.scss',
})
export class PersonCard {
  role = input.required<string>();
  initials = input.required<string>();
  variant = input<AvatarVariant>('default');
  hint = input<string | null>(null);
  avatarTestId = input<string | null>(null);
  testId = input<string | null>(null);
}
