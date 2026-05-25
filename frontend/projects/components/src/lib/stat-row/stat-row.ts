import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-stat-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-row.html',
  styleUrl: './stat-row.scss',
})
export class StatRow {}
