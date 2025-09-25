import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DailyForecast } from '../../features/home/home-page.service';

@Component({
  selector: 'app-forecast-list',
  imports: [CommonModule],
  templateUrl: './forecast-list.html',
  styleUrl: './forecast-list.scss',
})
export class ForecastList {
  readonly forecast = input<DailyForecast[] | null>([]);

  protected readonly hasForecast = computed(
    () => (this.forecast()?.length ?? 0) > 0
  );
}
