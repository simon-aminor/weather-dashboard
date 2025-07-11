import { Component } from '@angular/core';
import { CitySearch } from "../../shared/city-search/city-search";
import { ForecastList } from "../../shared/forecast-list/forecast-list";
import { WeatherCard } from "../../shared/weather-card/weather-card";
import { UnitToggle } from "../../shared/unit-toggle/unit-toggle";

@Component({
  selector: 'app-home-page',
  imports: [CitySearch, ForecastList, WeatherCard, UnitToggle],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePageComponent {

}
