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
  protected filteredZones = signal<Zone[]>(Zones);
  protected zoneList = signal<Zone[]>(Zones);
  protected dropDown = viewChild<ElementRef<HTMLInputElement>>('dropDown');

  ngAfterViewInit(): void {
    const inputEl = this.searchBox().nativeElement;
    const dropDownEl = this.dropDown()?.nativeElement;

    fromEvent(this.searchBox().nativeElement, 'focus').subscribe(() => {
      this.showDropdown.set(true);
      if (dropDownEl) {
        dropDownEl.classList.remove('h-0');
        dropDownEl.classList.remove('opacity-0');
        dropDownEl.classList.add('opacity-100');
        dropDownEl.classList.add('translate-y-0');
        dropDownEl.classList.add('h-[300px]');
      }
    });

    fromEvent(this.searchBox().nativeElement, 'blur').subscribe(() => {
      setTimeout(() => {
        this.showDropdown.set(false);
        if (dropDownEl) {
          dropDownEl.classList.remove('h-[300px]');
          dropDownEl.classList.remove('opacity-100');
          dropDownEl.classList.add('opacity-0');
          dropDownEl.classList.add('h-0');
        }
      }, 200);
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
const Zones = [
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
];
