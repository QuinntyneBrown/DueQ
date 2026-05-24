import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-key-value-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="kv-list"><ng-content></ng-content></div>`,
  styles: `
    :host { display: block; margin-top: var(--s-5); }
    .kv-list { display: flex; flex-direction: column; }
  `,
})
export class KeyValueList {}
