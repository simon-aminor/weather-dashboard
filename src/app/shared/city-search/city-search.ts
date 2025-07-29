import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, fromEvent } from 'rxjs';
@Component({
  selector: 'app-city-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './city-search.html',
  styleUrl: './city-search.scss',
})
export class CitySearch {
  protected searchBox =
    viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
  protected showDropdown = signal<boolean>(false);
  protected searchTerm = signal<string | null>(null);
  protected filteredZones = signal<Zone[]>([]);
  protected zoneList = signal<Zone[]>([
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

  ngOnInit(): void {
    const inputEl = this.searchBox().nativeElement;

    fromEvent(this.searchBox().nativeElement, 'focus').subscribe(() => {
      this.showDropdown.set(true);
    });
    fromEvent(this.searchBox().nativeElement, 'blur').subscribe(() => {
      setTimeout(() => this.showDropdown.set(false), 200);
    });

    fromEvent(inputEl, 'input')
      .pipe(debounceTime(300))
      .subscribe(() => {
        const term = inputEl.value.trim().toLowerCase();
        this.searchTerm.set(term);

        // filter cities
        const result = this.zoneList().filter((zone) =>
          zone.city.toLowerCase().includes(term)
        );
        this.filteredZones.set(result);
        console.log(this.filteredZones());
      });
  }

  setSearchedValue(zone: Zone) {
    console.log(zone);
    this.searchTerm.set(`${zone.city}, ${zone.country}`);
  }
}
interface Zone {
  city: string;
  country: string;
}
