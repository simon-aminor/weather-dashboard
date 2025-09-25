import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface ThemeOption {
  value: ThemePreference;
  label: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly preferenceSignal = signal<ThemePreference>('system');
  private readonly systemPrefersDark = signal(false);

  readonly preference = this.preferenceSignal.asReadonly();
  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const preference = this.preferenceSignal();
    if (preference === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return preference;
  });

  readonly themeOptions: ThemeOption[] = [
    {
      value: 'system',
      label: 'System',
      description: 'Follow device appearance',
    },
    {
      value: 'light',
      label: 'Daylight',
      description: 'Bright and airy colors',
    },
    {
      value: 'dark',
      label: 'Nightfall',
      description: 'Low-light optimized palette',
    },
  ];

  constructor() {
    if (this.isBrowser) {
      const stored = window.localStorage.getItem(
        'weather-dashboard.theme'
      ) as ThemePreference | null;
      if (stored && this.isValidPreference(stored)) {
        this.preferenceSignal.set(stored);
      }

      const media = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemPrefersDark.set(media.matches);

      const listener = (event: MediaQueryListEvent) =>
        this.systemPrefersDark.set(event.matches);

      media.addEventListener('change', listener);
      this.destroyRef.onDestroy(() =>
        media.removeEventListener('change', listener)
      );
    }

    effect(() => {
      const theme = this.effectiveTheme();
      if (!this.isBrowser) {
        return;
      }
      const root = this.document.documentElement;
      root.classList.toggle('dark', theme === 'dark');
      root.setAttribute('data-theme', theme);
    });
  }

  setTheme(preference: ThemePreference) {
    if (!this.isValidPreference(preference)) {
      return;
    }
    this.preferenceSignal.set(preference);
    if (this.isBrowser) {
      window.localStorage.setItem('weather-dashboard.theme', preference);
    }
  }

  private isValidPreference(value: string): value is ThemePreference {
    return value === 'system' || value === 'light' || value === 'dark';
  }
}
