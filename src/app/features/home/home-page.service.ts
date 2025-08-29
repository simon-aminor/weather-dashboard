import { inject, Injectable } from '@angular/core';
import { firstValueFrom, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  readonly http = inject(HttpClient);

  async getWeather(lat: number, lon: number) {
    const urlAddress = `${environment.apiBaseUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.openWeatherMapApiKey}&units=metric`;
    const weatherCondition: any = await firstValueFrom(
      this.http.get(urlAddress)
    );

    // attach icon url
    if (weatherCondition.weather?.length) {
      const iconCode = weatherCondition.weather[0].icon;
      weatherCondition.weatherIconUrl = `${environment.apiBaseUrl}img/wn/${iconCode}@2x.png`;
    }

    return weatherCondition;
  }
}
export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
  /** Custom property we add in service */
  weatherIconUrl?: string;
}
