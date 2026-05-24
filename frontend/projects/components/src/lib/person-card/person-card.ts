import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarLarge } from '../avatar-large/avatar-large';
import { AvatarVariant } from '../models';

@Component({
  selector: 'lib-person-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarLarge],
  template: `
    <div class="person-card">
      <div class="role">{{ role() }}</div>
      <div class="avatar-row">
        <lib-avatar-large [initials]="initials()" [variant]="variant()"></lib-avatar-large>
        @if (hint()) {
          <div class="hint">{{ hint() }}</div>
        }
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host { display: block; }
    .person-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-3);
      padding: var(--s-5);
      display: flex;
      flex-direction: column;
      gap: var(--s-4);
    }
    .role {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    .avatar-row {
      display: flex;
      align-items: center;
      gap: var(--s-4);
    }
    .hint {
      font-size: 12px;
      color: var(--muted);
    }
  `,
})
export class PersonCard {
  role = input.required<string>();
  initials = input.required<string>();
  variant = input<AvatarVariant>('default');
  hint = input<string | null>(null);
}
