import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from 'api';
import { BrandMark, FormField, TextInput } from 'components';

@Component({
  selector: 'app-forgot-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, BrandMark, FormField, TextInput],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.scss',
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly form = this.fb.nonNullable.group({ email: [''] });
  protected readonly submittedEmail = signal<string | null>(null);
  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    const email = this.form.controls.email.value;

    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.submittedEmail.set(email);
        this.submitting.set(false);
      },
      // Same UX on error: we don't want to reveal whether the email exists.
      error: () => {
        this.submittedEmail.set(email);
        this.submitting.set(false);
      },
    });
  }
}
