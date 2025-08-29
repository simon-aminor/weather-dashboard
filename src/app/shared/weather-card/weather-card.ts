import { Component, effect, input } from '@angular/core';
import { WeatherResponse } from '../../features/home/home-page.service';

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})
export class WeatherCard {
  weatherData = input<WeatherResponse | null>();

  #effect = effect(() => {
    console.log(this.weatherData());
  });
}
