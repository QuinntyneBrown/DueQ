import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-head">
      <h1>Good {{ timeOfDay }}</h1>
    </div>
  `,
})
export class DashboardPage {
  protected readonly timeOfDay = computeTimeOfDay(new Date().getHours());
}

export function computeTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
