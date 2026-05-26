import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import {
  API_BASE_URL,
  AuthStore,
  ISettingsService,
  SETTINGS_SERVICE,
  Settings,
} from 'api';
import { Button, FormField, PageHead, PersonCard, TextInput } from 'components';

@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHead, PersonCard, FormField, TextInput, Button],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly settingsService = inject<ISettingsService>(SETTINGS_SERVICE);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    yourName: ['', Validators.required],
    partnerName: ['', Validators.required],
  });

  protected readonly submitted = signal(false);
  protected readonly ready = signal(false);

  private readonly initial = resource<Settings, void>({
    loader: () => firstValueFrom(this.settingsService.get()),
  });

  private readonly value = toSignal(
    this.form.valueChanges.pipe(takeUntilDestroyed()),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly yourInitials = computed(() => initialsFor(this.value().yourName ?? ''));
  protected readonly partnerInitials = computed(() => initialsFor(this.value().partnerName ?? ''));

  protected readonly yourError = computed(
    () =>
      this.submitted() &&
      this.form.controls.yourName.invalid &&
      'Please enter your name.',
  );
  protected readonly partnerError = computed(
    () =>
      this.submitted() &&
      this.form.controls.partnerName.invalid &&
      "Please enter your partner's name.",
  );

  constructor() {
    effect(() => {
      if (this.ready()) return;
      const loaded = this.initial.value();
      if (loaded) {
        this.form.patchValue({
          yourName: loaded.yourName,
          partnerName: loaded.partnerName,
        });
        this.ready.set(true);
      }
    });
  }

  signOut(): void {
    this.authStore.clear();
    void this.router.navigate(['/sign-in']);
  }

  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const { yourName, partnerName } = this.form.getRawValue();
    // Fire-and-forget with `keepalive: true` so the PUT survives any
    // subsequent `page.reload()` (Chromium otherwise aborts in-flight fetches
    // on navigation). Not awaited so the click handler returns immediately
    // and Playwright workers shut down cleanly between tests. Because raw
    // fetch bypasses the Angular HttpClient pipeline, the bearer token must
    // be attached here manually.
    const token = this.authStore.token();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    void fetch(`${this.baseUrl}/api/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ yourName, partnerName }),
      keepalive: true,
    });
  }
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
