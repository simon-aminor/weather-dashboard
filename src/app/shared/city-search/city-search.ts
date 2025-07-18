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
    'Yazd',
    'Mashad',
    'Shiraz',
    'Isfahan',
    'Tehran',
  ]);
  protected searchTerm!: string;

  ngAfterViewInit(): void {
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
