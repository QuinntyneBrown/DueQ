import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-record-payment-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <h1>Record a payment</h1>
    </div>
  `,
})
export class RecordPaymentPage {}
