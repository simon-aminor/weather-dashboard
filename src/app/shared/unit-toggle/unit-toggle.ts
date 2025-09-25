import { NgClass } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

@Component({
  selector: 'app-unit-toggle',
  imports: [NgClass],
  templateUrl: './unit-toggle.html',
  styleUrl: './unit-toggle.scss',
})
export class UnitToggle {
  readonly selectedUnit = input<TemperatureUnit>('celsius');
  readonly unitChange = output<TemperatureUnit>();

  protected readonly units = signal<TemperatureUnit[]>([
    'celsius',
    'fahrenheit',
  ]);

  protected selectUnit(unit: TemperatureUnit) {
    if (this.selectedUnit() === unit) {
      return;
    }
    this.unitChange.emit(unit);
  }

  protected labelFor(unit: TemperatureUnit) {
    return unit === 'celsius' ? '°C' : '°F';
  }

  protected isActive(unit: TemperatureUnit) {
    return this.selectedUnit() === unit;
  }
}
