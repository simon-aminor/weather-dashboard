import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, fromEvent, map, switchMap } from 'rxjs';
import { CitySearchService } from './city-search.service';
@Component({
  selector: 'city-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './city-search.html',
  styleUrl: './city-search.scss',
  providers: [CitySearchService],
})
export class CitySearch {
  private readonly citySearch = inject(CitySearchService);

  protected searchBox =
    viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
  protected dropDown = viewChild<ElementRef<HTMLInputElement>>('dropDown');

  protected zoneList = signal<Zone[]>([]);
  protected filteredZones = signal<Zone[]>([]);
  protected searchTerm = signal<string | null>(null);
  protected showDropdown = signal<boolean>(false);
  protected readonly selectedCity = output<Zone>();

  #effect = effect(() => {});

  async ngOnInit(): Promise<void> {
    await this.fillInitailList();
  }

  ngAfterViewInit(): void {
    const inputEl = this.searchBox().nativeElement;
    const dropDownEl = this.dropDown()?.nativeElement;

    fromEvent(this.searchBox().nativeElement, 'focus').subscribe(() => {
      this.showDropdown.set(true);
    });

    fromEvent(this.searchBox().nativeElement, 'blur').subscribe(() => {
      if (dropDownEl) {
        setTimeout(() => {
          this.showDropdown.set(false);
        }, 100);
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

  async fillInitailList() {
    const initailCityList = await this.citySearch.getCityList('Iran');
    this.zoneList.set(initailCityList);
    this.filteredZones.set(this.zoneList());
  }

  protected setSearchedValue(zone: Zone) {
    this.searchTerm.set(`${zone.name}, ${zone.country}`);
    this.selectedCity.emit(zone);
  }
}
interface Zone {
  name: string;
  lat: number;
  lon: number;
  country: string; // short form e.g US
  state?: string;
}
