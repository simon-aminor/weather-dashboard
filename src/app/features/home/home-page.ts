import { Component, inject, signal } from '@angular/core';
import { CitySearch, Zone } from '../../shared/city-search/city-search';
import { ForecastList } from '../../shared/forecast-list/forecast-list';
import { WeatherCard } from '../../shared/weather-card/weather-card';
import { UnitToggle, TemperatureUnit } from '../../shared/unit-toggle/unit-toggle';
import { HomeService, WeatherResponse } from './home-page.service';

@Component({
  selector: 'app-home-page',
  imports: [CitySearch, ForecastList, WeatherCard, UnitToggle],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent {
  private readonly apiService = inject(HomeService);

  protected weather = signal<WeatherResponse | null>(null);
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);
  protected selectedUnit = signal<TemperatureUnit>('celsius');

  async loadWeather(zone: Zone) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const result = await this.apiService.getWeather(zone.lat, zone.lon);
      this.weather.set(result);
    } catch (error) {
      console.error('Failed to fetch weather', error);
      this.weather.set(null);
      this.errorMessage.set(
        'Unable to load weather data right now. Please try another city or try again later.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onUnitChange(unit: TemperatureUnit) {
    this.selectedUnit.set(unit);
  }
}
