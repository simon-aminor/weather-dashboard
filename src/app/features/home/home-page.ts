import { Component, inject, signal } from '@angular/core';
import { CitySearch } from '../../shared/city-search/city-search';
import { ForecastList } from '../../shared/forecast-list/forecast-list';
import { WeatherCard } from '../../shared/weather-card/weather-card';
import { UnitToggle } from '../../shared/unit-toggle/unit-toggle';
import { HomeService } from './home-page.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [CitySearch, ForecastList, WeatherCard, UnitToggle],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent {
  private readonly apiService = inject(HomeService);

  protected weather = signal<any | null>(null);

  async loadWeather(e: any) {
    this.apiService
      .getWeather(e.lat, e.lon)
      .then((result) => {
        this.weather.set(result);
      })
      .catch(() => {
        throwError(() => new Error('error while fetching your location data!'));
      });
  }
}
