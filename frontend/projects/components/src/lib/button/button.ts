import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonSize, ButtonVariant } from '../models';

@Component({
  selector: 'lib-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      class="btn"
      [class]="cssClasses()"
      [disabled]="disabled()"
      (click)="clicked.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    :host { display: inline-block; }
    :host([block]) { display: block; }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--s-2);
      height: 44px;
      padding: 0 var(--s-4);
      border-radius: var(--r-2);
      font-size: 14px;
      font-weight: 600;
      border: 1px solid transparent;
      background: var(--surface);
      color: var(--ink);
      white-space: nowrap;
      cursor: pointer;
      font-family: inherit;
      transition: transform 0.08s ease;
    }
    .btn:active:not(:disabled) { transform: scale(0.98); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn.block { width: 100%; }
    .btn.lg { height: 52px; font-size: 15px; }
    .btn.primary { background: var(--ink); color: var(--bg); }
    .btn.secondary {
      background: rgba(255,255,255,0.08);
      color: var(--bg);
      border-color: rgba(255,255,255,0.15);
    }
    .btn.ghost { background: transparent; color: var(--ink-2); }
    .btn.outline {
      background: var(--surface);
      border-color: var(--border-strong);
      color: var(--ink);
    }
    .btn.danger {
      background: transparent;
      color: var(--owed-by-you);
      border-color: var(--border);
    }
  `,
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
