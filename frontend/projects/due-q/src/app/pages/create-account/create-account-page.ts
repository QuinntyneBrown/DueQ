import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthStore } from 'api';
import { BrandMark, FormField, TextInput } from 'components';

@Component({
  selector: 'app-create-account-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, BrandMark, FormField, TextInput],
  templateUrl: './create-account-page.html',
  styleUrl: './create-account-page.scss',
})
export class CreateAccountPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    name: [''],
    email: [''],
    password: [''],
  });

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.errorMessage.set(null);
    this.submitting.set(true);

    const { name, email, password } = this.form.getRawValue();
    this.auth.register({ name, email, password }).subscribe({
      next: (result) => {
        this.store.setSession(result.token, result.user, { remember: true });
        void this.router.navigateByUrl('/dashboard');
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.errorMessage.set(this.toMessage(err));
      },
    });
  }

  private toMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse && err.status === 400) {
      const errors = (err.error as { errors?: Record<string, string[]> } | null)?.errors;
      const all = errors ? Object.values(errors).flat() : [];
      const dup = all.find((m) => /already exists/i.test(m));
      if (dup) return dup;
      if (all.length > 0) return all[0];
      return 'Please check the form and try again.';
    }
    return 'Could not create account. Please try again.';
  }
}
