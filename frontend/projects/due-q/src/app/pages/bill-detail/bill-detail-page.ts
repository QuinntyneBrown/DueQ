import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bill-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <h1>Bill</h1>
    </div>
  `,
})
export class BillDetailPage {}
