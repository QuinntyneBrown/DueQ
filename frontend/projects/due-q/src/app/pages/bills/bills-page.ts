import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bills-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <h1>Bills</h1>
    </div>
  `,
})
export class BillsPage {}
