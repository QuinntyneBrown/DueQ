import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from 'api';
import { BrandMark, FormField, TextInput } from 'components';

// Stub page — no `docs/mocks/reset-password.html` exists, so this view is not
// held to gold-standard parity. It reuses the auth shell for layout
// consistency. See docs/oauth2-signin-plan.md (Slice 6.5).
@Component({
  selector: 'app-reset-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, BrandMark, FormField, TextInput],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
})
export class ResetPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    password: [''],
    confirm: [''],
  });

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submitting = signal(false);

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly token = computed(() => this.queryParams().get('token'));
  protected readonly missingToken = computed(() => !this.token());

  submit(): void {
    if (this.submitting()) return;
    this.errorMessage.set(null);

    const { password, confirm } = this.form.getRawValue();
    const token = this.token();

    if (!token) {
      this.errorMessage.set('This reset link is missing its token.');
      return;
    }
    if (password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.submitting.set(true);
    this.auth.resetPassword(token, password).subscribe({
      next: () => {
        void this.router.navigate(['/sign-in']);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err instanceof HttpErrorResponse && err.status === 400
            ? 'This reset link is no longer valid.'
            : 'Could not reset password. Please try again.',
        );
      },
    });
  }
}
