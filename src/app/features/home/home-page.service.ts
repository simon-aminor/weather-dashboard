import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UnitSystem } from '../../shared/unit-toggle/unit-toggle';
import { getWeatherIconAsset } from '../../shared/weather-icons';

const UNIT_SYMBOL_MAP: Record<UnitSystem, string> = {
  metric: '°C',
  imperial: '°F',
  standard: 'K',
};

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  readonly http = inject(HttpClient);

  async getWeather(
    lat: number,
    lon: number,
    unit: UnitSystem
  ): Promise<WeatherResponse> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      appid: environment.openWeatherMapApiKey,
    });

    params.set('units', unit);

    const urlAddress = `${
      environment.apiBaseUrl
    }data/2.5/weather?${params.toString()}`;

    try {
      const weatherCondition = await firstValueFrom(
        this.http.get<WeatherResponse>(urlAddress)
      );

      if (weatherCondition.weather?.length) {
        const iconCode = weatherCondition.weather[0].icon;
        weatherCondition.weatherIconUrl = this.buildIconUrl(iconCode);
      }

      return weatherCondition;
    } catch (error) {
      console.error('HomeService.getWeather failed', error);
      throw error;
    }
  }

  async getForecast(
    lat: number,
    lon: number,
    unit: UnitSystem
  ): Promise<DailyForecast[]> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      appid: environment.openWeatherMapApiKey,
      units: unit,
      cnt: '40',
    });

    const urlAddress = `${
      environment.apiBaseUrl
    }data/2.5/forecast?${params.toString()}`;

    try {
      const forecast = await firstValueFrom(
        this.http.get<ForecastResponse>(urlAddress)
      );

      return this.transformToDailyForecast(forecast, unit);
    } catch (error) {
      console.error('HomeService.getForecast failed', error);
      throw error;
    }
  }

  private transformToDailyForecast(
    forecast: ForecastResponse,
    unit: UnitSystem
  ): DailyForecast[] {
    if (!forecast?.list?.length) {
      return [];
    }

    const timezoneOffset = forecast.city?.timezone ?? 0;

    interface AggregatedDay {
      timestamp: number;
      minTemp: number;
      maxTemp: number;
      bestSample: ForecastEntry;
      bestHourDiff: number;
    }

    const aggregates = new Map<string, AggregatedDay>();

    for (const entry of forecast.list) {
      const localTimestamp = (entry.dt + timezoneOffset) * 1000;
      const localDate = new Date(localTimestamp);
      const dayKey = `${localDate.getUTCFullYear()}-${localDate.getUTCMonth()}-${localDate.getUTCDate()}`;

      const hourDiff = Math.abs(localDate.getUTCHours() - 12);
      const minTemp = entry.main?.temp_min ?? entry.main?.temp;
      const maxTemp = entry.main?.temp_max ?? entry.main?.temp;

      if (!aggregates.has(dayKey)) {
        if (minTemp == null || maxTemp == null) {
          continue;
        }
        aggregates.set(dayKey, {
          timestamp: localTimestamp,
          minTemp,
          maxTemp,
          bestSample: entry,
          bestHourDiff: hourDiff,
        });
        continue;
      }

      const aggregate = aggregates.get(dayKey)!;

      if (minTemp != null) {
        aggregate.minTemp = Math.min(aggregate.minTemp, minTemp);
      }
      if (maxTemp != null) {
        aggregate.maxTemp = Math.max(aggregate.maxTemp, maxTemp);
      }

      if (hourDiff < aggregate.bestHourDiff) {
        aggregate.bestHourDiff = hourDiff;
        aggregate.bestSample = entry;
        aggregate.timestamp = localTimestamp;
      }
    }

    const dayFormatter = new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      timeZone: 'UTC',
    });
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });

    const unitSymbol = UNIT_SYMBOL_MAP[unit];

    const days = Array.from(aggregates.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 6)
      .map((aggregate) => {
        const sample = aggregate.bestSample;
        const date = new Date(aggregate.timestamp);
        const iconCode = sample.weather?.[0]?.icon;

        const precipitation = this.extractPrecipitation(sample);

        return {
          timestamp: aggregate.timestamp,
          dayLabel: dayFormatter.format(date),
          dateLabel: dateFormatter.format(date),
          iconUrl: this.buildIconUrl(iconCode),
          description: sample.weather?.[0]?.description ?? 'Forecast',
          minTemp: Math.round(aggregate.minTemp),
          maxTemp: Math.round(aggregate.maxTemp),
          humidity: sample.main?.humidity ?? null,
          windLabel: this.formatWind(sample.wind?.speed, unit),
          precipitation,
          unitSymbol,
        } satisfies DailyForecast;
      });

    if (days.length) {
      days[0] = {
        ...days[0],
        dayLabel: 'Today',
      } satisfies DailyForecast;
    }

    return days;
  }

  private formatWind(
    speed: number | undefined,
    unit: UnitSystem
  ): string | null {
    if (speed == null) {
      return null;
    }

    switch (unit) {
      case 'imperial':
        return `${Math.round(speed)} mph`;
      case 'metric':
        return `${Math.round(speed * 3.6)} km/h`;
      default:
        return `${Math.round(speed)} m/s`;
    }
  }

  private extractPrecipitation(entry: ForecastEntry): number | null {
    const rain = entry.rain?.['3h'];
    const snow = entry.snow?.['3h'];
    const total = (rain ?? 0) + (snow ?? 0);
    if (total <= 0) {
      return null;
    }
    return Math.round(total * 10) / 10;
  }

  private buildIconUrl(iconCode: string | undefined) {
    return getWeatherIconAsset(iconCode);
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
  weatherIconUrl?: string | null;
}

export interface DailyForecast {
  timestamp: number;
  dayLabel: string;
  dateLabel: string;
  iconUrl: string | null;
  description: string;
  minTemp: number | null;
  maxTemp: number | null;
  humidity: number | null;
  windLabel: string | null;
  precipitation: number | null;
  unitSymbol: string;
}

interface ForecastResponse {
  list: ForecastEntry[];
  city: {
    name: string;
    country: string;
    timezone: number;
  };
}

interface ForecastEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level?: number;
    grnd_level?: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
  clouds?: {
    all: number;
  };
}

