import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  ThemeOption,
  ThemePreference,
  ThemeService,
} from '../../core/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  private readonly themeService = inject(ThemeService);

  protected readonly options: ThemeOption[] = this.themeService.themeOptions;
  protected readonly activePreference = computed(() =>
    this.themeService.preference()
  );
  protected readonly effectiveTheme = this.themeService.effectiveTheme;

  protected isActive(option: ThemePreference) {
    return this.activePreference() === option;
  }

  protected select(option: ThemePreference) {
    this.themeService.setTheme(option);
  }
}
