import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-key-value-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './key-value-list.html',
  styleUrl: './key-value-list.scss',
})
export class KeyValueList {}
