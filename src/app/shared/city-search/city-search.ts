import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-search',
  imports: [FormsModule],
  templateUrl: './city-search.html',
  styleUrl: './city-search.scss',
})
export class CitySearch {
  dropDownShow = signal<boolean>(false);
  cityList = signal<any[]>([]);
  searchTerm!: string;

  searchCity(e: Event) {
    console.log(e);
  }
}
