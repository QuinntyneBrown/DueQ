import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-bill-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <h1>Add a bill</h1>
    </div>
  `,
})
export class AddBillPage {}
