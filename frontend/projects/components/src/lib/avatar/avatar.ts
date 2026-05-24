import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarVariant } from '../models';

@Component({
  selector: 'lib-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  initials = input.required<string>();
  variant = input<AvatarVariant>('default');

  variantClass(): string {
    return this.variant();
  }
}
