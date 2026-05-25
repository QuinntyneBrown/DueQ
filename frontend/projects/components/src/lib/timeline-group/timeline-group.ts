import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-timeline-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-group.html',
  styleUrl: './timeline-group.scss',
})
export class TimelineGroup {
  month = input.required<string>();
  total = input<string | null>(null);
}
