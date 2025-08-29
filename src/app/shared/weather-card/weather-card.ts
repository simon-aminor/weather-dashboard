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
// module.exports = {
//   content: ["./src/**/*.{html,ts,scss}"],
//   theme: {
//     extend: {
//       keyframes: {
//         "slide-fade-in": {
//           "0%": { opacity: "0", transform: "translateY(-10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "slide-fade-out": {
//           "0%": { opacity: "1", transform: "translateY(0)" },
//           "100%": { opacity: "0", transform: "translateY(-10px)" },
//         },
//       },
//       animation: {
//         "slide-fade": "slide-fade-in 0.3s ease forwards",
//         "slide-fade-reverse": "slide-fade-out 0.3s ease forwards",
//       },
//     },
//   },
//   plugins: [],
// };
