import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-city-search',
  imports: [FormsModule],
  templateUrl: './city-search.html',
  styleUrl: './city-search.scss',
})
export class CitySearch {
  protected searchBox =
    viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
  protected showDropdown = signal<boolean>(false);
  protected cityList = signal<any[]>([
    { city: 'Tokyo', country: 'Japan' },
    { city: 'Paris', country: 'France' },
    { city: 'Sydney', country: 'Australia' },
    { city: 'Rio de Janeiro', country: 'Brazil' },
    { city: 'Cairo', country: 'Egypt' },
    { city: 'Toronto', country: 'Canada' },
    { city: 'Berlin', country: 'Germany' },
    { city: 'Bangkok', country: 'Thailand' },
    { city: 'Nairobi', country: 'Kenya' },
    { city: 'Rome', country: 'Italy' },
    { city: 'New York', country: 'USA' },
    { city: 'Moscow', country: 'Russia' },
    { city: 'Dubai', country: 'UAE' },
    { city: 'Buenos Aires', country: 'Argentina' },
    { city: 'Seoul', country: 'South Korea' },
  ]);
  protected searchTerm!: string;

  ngOnInit(): void {
    fromEvent(this.searchBox().nativeElement, 'focus').subscribe(() => {
      this.showDropdown.set(true);
    });
    fromEvent(this.searchBox().nativeElement, 'blur').subscribe(() => {
      setTimeout(() => this.showDropdown.set(false), 200);
    });
  }

  searchCity(e: Event) {
    console.log(e);
  }
}
