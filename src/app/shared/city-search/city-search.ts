import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, fromEvent, map, switchMap } from 'rxjs';
import { CitySearchService } from './city-search.service';
@Component({
  selector: 'app-city-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './city-search.html',
  styleUrl: './city-search.scss',
  providers: [CitySearchService],
})
export class CitySearch {
  private readonly citySearch = inject(CitySearchService);
  protected searchBox =
    viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
  protected showDropdown = signal<boolean>(false);
  protected searchTerm = signal<string | null>(null);
  protected filteredZones = signal<Zone[]>([]);
  protected zoneList = signal<Zone[]>([]);
  protected dropDown = viewChild<ElementRef<HTMLInputElement>>('dropDown');

  async ngOnInit(): Promise<void> {
    await this.fillInitailList();
  }

  async fillInitailList() {
    const initailCityList = await this.citySearch.getCityList('london');
    this.zoneList.set(initailCityList);
  }

  ngAfterViewInit(): void {
    const inputEl = this.searchBox().nativeElement;
    const dropDownEl = this.dropDown()?.nativeElement;

    fromEvent(this.searchBox().nativeElement, 'focus').subscribe(() => {
      this.showDropdown.set(true);
    });

    fromEvent(this.searchBox().nativeElement, 'blur').subscribe(() => {
      this.showDropdown.set(false);
      if (dropDownEl) {
        setTimeout(() => {
          dropDownEl.classList.add(
            'invisible',
            'pointer-events-none',
            'max-h-0'
          );
        }, 200);
      }
    });

    fromEvent(inputEl, 'input')
      .pipe(
        debounceTime(300),
        map(() => inputEl.value.trim().toLowerCase()),
        switchMap((term) => this.citySearch.getCityList(term))
      )
      .subscribe({
        next: (filteredList) => {
          this.filteredZones.set(filteredList);
        },
        error: (err) => {
          console.error('Search failed:', err);
        },
      });
  }

  setSearchedValue(zone: Zone) {
    this.searchTerm.set(`${zone.city}, ${zone.country}`);
  }
}
interface Zone {
  city: string;
  lat: number;
  lon: number;
  country: string;
}
