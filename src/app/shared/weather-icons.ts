const ICON_CODE_MAP: Record<string, string> = {
  '01d': 'clear-day.png',
  '01n': 'clear-night.png',
  '02d': 'partly-cloudy-day.png',
  '02n': 'partly-cloudy-night.png',
  '03d': 'overcast-day.png',
  '03n': 'overcast-night.png',
  '04d': 'overcast-day.png',
  '04n': 'overcast-night.png',
  '09d': 'partly-cloudy-day-rain.png',
  '09n': 'partly-cloudy-night-rain.png',
  '10d': 'overcast-day-rain.png',
  '10n': 'overcast-night-rain.png',
  '11d': 'thunderstorms-day.png',
  '11n': 'thunderstorms-night.png',
  '13d': 'overcast-day-snow.png',
  '13n': 'overcast-night-snow.png',
  '50d': 'fog-day.png',
  '50n': 'fog-night.png',
};

const DEFAULT_ICON = 'mist.png';
const ICON_BASE_PATH = 'assets/weather';

/**
 * Maps OpenWeather icon codes to locally bundled Bas Milius weather icons.
 * Source: https://github.com/basmilius/weather-icons (MIT License).
 */
export function getWeatherIconAsset(iconCode: string | undefined | null): string {
  const toPath = (filename: string) => `${ICON_BASE_PATH}/${filename}`;

  if (!iconCode) {
    return toPath(DEFAULT_ICON);
  }

  const normalized = iconCode.toLowerCase();
  const filename = ICON_CODE_MAP[normalized];
  if (filename) {
    return toPath(filename);
  }

  const dayKey = normalized.replace(/[dn]$/, 'd');
  const dayFallback = ICON_CODE_MAP[dayKey];
  if (dayFallback) {
    return toPath(dayFallback);
  }

  return toPath(DEFAULT_ICON);
}
