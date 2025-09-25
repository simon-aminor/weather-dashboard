import { NgClass } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

export type UnitSystem = 'metric' | 'imperial' | 'standard';

interface UnitOption {
  value: UnitSystem;
  label: string;
  symbol: string;
  windHint: string;
}

@Component({
  selector: 'app-unit-toggle',
  imports: [NgClass],
  templateUrl: './unit-toggle.html',
  styleUrl: './unit-toggle.scss',
})
export class UnitToggle {
  readonly selectedUnit = input<UnitSystem>('metric');
  readonly unitChange = output<UnitSystem>();

  protected readonly unitOptions = signal<UnitOption[]>([
    { value: 'metric', label: 'Metric', symbol: '°C', windHint: 'km/h' },
    { value: 'imperial', label: 'Imperial', symbol: '°F', windHint: 'mph' },
    { value: 'standard', label: 'Kelvin', symbol: 'K', windHint: 'm/s' },
  ]);

  protected selectUnit(unit: UnitSystem) {
    if (this.selectedUnit() === unit) {
      return;
    }
    this.unitChange.emit(unit);
  }

  protected isActive(option: UnitOption) {
    return this.selectedUnit() === option.value;
  }
}
