import { Component, inject, signal } from '@angular/core';
import { CitySearch, Zone } from '../../shared/city-search/city-search';
import { ForecastList } from '../../shared/forecast-list/forecast-list';
import { WeatherCard } from '../../shared/weather-card/weather-card';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';
import { UnitSystem, UnitToggle } from '../../shared/unit-toggle/unit-toggle';
import {
  DailyForecast,
  HomeService,
  WeatherResponse,
} from './home-page.service';

@Component({
  selector: 'app-home-page',
  imports: [CitySearch, ForecastList, WeatherCard, UnitToggle, ThemeToggle],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent {
  private readonly apiService = inject(HomeService);

  protected weather = signal<WeatherResponse | null>(null);
  protected forecast = signal<DailyForecast[]>([]);
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);
  protected selectedUnit = signal<UnitSystem>('metric');
  protected selectedZone = signal<Zone | null>(null);

  async loadWeather(zone: Zone) {
    this.selectedZone.set(zone);
    await this.fetchWeather(zone, this.selectedUnit());
  }

  protected async onUnitChange(unit: UnitSystem) {
    this.selectedUnit.set(unit);
    const zone = this.selectedZone();
    if (zone) {
      await this.fetchWeather(zone, unit);
    }
  }

  private async fetchWeather(zone: Zone, unit: UnitSystem) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const [weatherResult, forecastResult] = await Promise.allSettled([
        this.apiService.getWeather(zone.lat, zone.lon, unit),
        this.apiService.getForecast(zone.lat, zone.lon, unit),
      ]);

      if (weatherResult.status === 'fulfilled') {
        this.weather.set(weatherResult.value);
      } else {
        throw weatherResult.reason;
      }

      if (forecastResult.status === 'fulfilled') {
        this.forecast.set(forecastResult.value);
      } else {
        console.warn('Forecast retrieval failed', forecastResult.reason);
        this.forecast.set([]);
      }
    } catch (error) {
      console.error('Failed to fetch weather', error);
      this.weather.set(null);
      this.forecast.set([]);
      this.errorMessage.set(
        'Unable to load weather data right now. Please try another city or try again later.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
