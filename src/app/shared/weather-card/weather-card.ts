import { Component, computed, input } from '@angular/core';
import { WeatherResponse } from '../../features/home/home-page.service';
import { UnitSystem } from '../unit-toggle/unit-toggle';

const UNIT_SYMBOL: Record<UnitSystem, string> = {
  metric: '°C',
  imperial: '°F',
  standard: 'K',
};

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})
export class WeatherCard {
  weatherData = input<WeatherResponse | null>();
  unit = input<UnitSystem>('metric');

  protected readonly unitLabel = computed(() => UNIT_SYMBOL[this.unit()]);

  protected readonly iconUrl = computed(() => {
    const data = this.weatherData();
    if (!data) {
      return null;
    }

    if (data.weatherIconUrl) {
      return data.weatherIconUrl;
    }

    const iconCode = data.weather?.[0]?.icon;
    return iconCode
      ? `https://openweathermap.org/img/wn/${iconCode}@4x.png`
      : null;
  });

  protected readonly headline = computed(() => {
    const data = this.weatherData();
    if (!data?.weather?.length) {
      return null;
    }
    const [current] = data.weather;
    return {
      main: current.main,
      description: current.description,
    };
  });

  protected readonly coreTemp = computed(() => {
    const value = this.weatherData()?.main?.temp;
    return this.toDisplayTemperature(value);
  });

  protected readonly feelsLikeTemp = computed(() => {
    const value = this.weatherData()?.main?.feels_like;
    return this.toDisplayTemperature(value);
  });

  protected readonly minTemp = computed(() => {
    const value = this.weatherData()?.main?.temp_min;
    return this.toDisplayTemperature(value);
  });

  protected readonly maxTemp = computed(() => {
    const value = this.weatherData()?.main?.temp_max;
    return this.toDisplayTemperature(value);
  });

  protected readonly humidity = computed(() =>
    this.weatherData()?.main?.humidity ?? null
  );

  protected readonly pressure = computed(() =>
    this.weatherData()?.main?.pressure ?? null
  );

  protected readonly wind = computed(() => {
    const speed = this.weatherData()?.wind?.speed;
    if (speed == null) {
      return null;
    }

    switch (this.unit()) {
      case 'imperial':
        return `${Math.round(speed)} mph`;
      case 'metric':
        return `${Math.round(speed * 3.6)} km/h`;
      default:
        return `${Math.round(speed)} m/s`;
    }
  });

  protected readonly sunrise = computed(() => {
    const sys = this.weatherData()?.sys;
    const timezone = this.weatherData()?.timezone;
    if (!sys?.sunrise || timezone == null) {
      return null;
    }
    return this.toLocalTime(sys.sunrise, timezone);
  });

  protected readonly sunset = computed(() => {
    const sys = this.weatherData()?.sys;
    const timezone = this.weatherData()?.timezone;
    if (!sys?.sunset || timezone == null) {
      return null;
    }
    return this.toLocalTime(sys.sunset, timezone);
  });

  private toDisplayTemperature(value: number | undefined): number | null {
    if (value == null) {
      return null;
    }
    return Math.round(value);
  }

  private toLocalTime(timestamp: number, timezoneOffsetSeconds: number): string {
    const date = new Date((timestamp + timezoneOffsetSeconds) * 1000);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
