import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-section-head',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-head.html',
  styleUrl: './section-head.scss',
})
export class SectionHead {
  title = input.required<string>();
}
