import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackLink, Button, FormField, PageHead, PersonCard, TextInput } from 'components';
import { SETTINGS_SERVICE } from 'api';
import { toInitials } from '../utils/initials';

@Component({
  selector: 'lib-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BackLink, Button, FormField, PageHead, PersonCard, ReactiveFormsModule, TextInput],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SETTINGS_SERVICE);

  private readonly initial = toSignal(this.settingsService.get(), {
    initialValue: { yourName: '', partnerName: '' },
  });

  readonly form = this.fb.nonNullable.group({
    yourName: this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(1)]),
    partnerName: this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(1)]),
  });

  private readonly liveYou = toSignal(this.form.controls.yourName.valueChanges, {
    initialValue: this.form.controls.yourName.value,
  });
  private readonly livePartner = toSignal(this.form.controls.partnerName.valueChanges, {
    initialValue: this.form.controls.partnerName.value,
  });

  readonly yourInitials = computed(() => toInitials(this.liveYou()) || '?');
  readonly partnerInitials = computed(() => toInitials(this.livePartner()) || '?');

  readonly yourError = computed(() => this.errorFor('yourName'));
  readonly partnerError = computed(() => this.errorFor('partnerName'));

  constructor() {
    effect(() => {
      const v = this.initial();
      if (v.yourName || v.partnerName) {
        this.form.patchValue(v, { emitEvent: true });
      }
    });
  }

  private errorFor(field: 'yourName' | 'partnerName'): string | null {
    const c = this.form.controls[field];
    if (c.valid || !c.touched) return null;
    if (c.hasError('required') || c.hasError('minlength')) return 'Required';
    return 'Invalid';
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.settingsService.update(this.form.getRawValue()).subscribe();
  }
}
