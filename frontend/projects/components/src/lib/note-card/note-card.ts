import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-note-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss',
})
export class NoteCard {
  text = input.required<string>();
  testId = input<string | null>(null);
}
