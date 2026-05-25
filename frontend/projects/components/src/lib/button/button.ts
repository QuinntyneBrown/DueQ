import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonSize, ButtonVariant } from '../models';

@Component({
  selector: 'lib-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[attr.block]': 'block() ? "" : null',
  },
})
export class Button {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  block = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  clicked = output<Event>();

  cssClasses(): string {
    const classes: string[] = [this.variant()];
    if (this.size() === 'lg') classes.push('lg');
    if (this.block()) classes.push('block');
    return classes.join(' ');
  }
}
