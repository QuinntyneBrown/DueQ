import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field">
      <label [attr.for]="for()">
        {{ label() }}
        @if (hint()) {
          <span class="hint">({{ hint() }})</span>
        }
      </label>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host { display: block; }
    .field { display: flex; flex-direction: column; gap: var(--s-2); }
    label {
      font-size: 13px;
      font-weight: 500;
      color: var(--ink-2);
    }
    .hint {
      font-size: 12px;
      color: var(--muted);
      font-weight: 400;
      margin-left: 4px;
    }
  `,
})
export class FormField {
  label = input.required<string>();
  hint = input<string | null>(null);
  for = input<string | null>(null);
}
