import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  label = input.required<string>();
  hint = input<string | null>(null);
  for = input<string | null>(null);
  error = input<string | false | null>(null);
  errorTestId = input<string | null>(null);
}
