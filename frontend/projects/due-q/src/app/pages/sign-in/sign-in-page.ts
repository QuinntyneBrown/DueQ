import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, AuthStore } from 'api';
import { BrandMark, Checkbox, FormField, TextInput } from 'components';

@Component({
  selector: 'app-sign-in-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    BrandMark,
    Checkbox,
    FormField,
    TextInput,
  ],
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.scss',
})
export class SignInPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.fb.nonNullable.group({
    email: [''],
    password: [''],
    remember: [true],
  });

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submitting = signal(false);

  submit(): void {
    if (this.submitting()) return;
    this.errorMessage.set(null);
    this.submitting.set(true);

    const { email, password, remember } = this.form.getRawValue();
    this.auth.login({ email, password }).subscribe({
      next: (result) => {
        this.store.setSession(result.token, result.user, { remember });
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.errorMessage.set(this.toMessage(err));
      },
    });
  }

  private toMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse && err.status === 400) {
      return 'Email or password is incorrect';
    }
    return 'Sign-in failed. Please try again.';
  }
}
