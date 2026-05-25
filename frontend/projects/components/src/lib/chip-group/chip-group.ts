import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-chip-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip-group.html',
  styleUrl: './chip-group.scss',
})
export class ChipGroup {}
