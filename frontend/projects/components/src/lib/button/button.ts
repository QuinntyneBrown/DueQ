import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonSize, ButtonVariant, LinkTarget } from '../models';

@Component({
  selector: 'lib-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
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
  href = input<string | null>(null);
  routerLink = input<LinkTarget>(null);
  ariaLabel = input<string | null>(null);
  testId = input<string | null>(null);
  clicked = output<Event>();

  cssClasses(): string {
    const classes: string[] = [this.variant()];
    if (this.size() === 'lg') classes.push('lg');
    if (this.block()) classes.push('block');
    return classes.join(' ');
  }

  onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.clicked.emit(event);
  }
}
