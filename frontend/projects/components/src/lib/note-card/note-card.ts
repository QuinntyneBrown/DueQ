import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-note-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="note-card">{{ text() }}</div>`,
  styles: `
    :host { display: block; }
    .note-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-3);
      padding: var(--s-4);
      font-size: 14px;
      color: var(--ink-2);
      line-height: 1.5;
    }
  `,
})
export class NoteCard {
  text = input.required<string>();
}
