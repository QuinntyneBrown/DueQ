import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-page-head',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-head.html',
  styleUrl: './page-head.scss',
})
export class PageHead {
  title = input.required<string>();
  subtitle = input<string | null>(null);
}
