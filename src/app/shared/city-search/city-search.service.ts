import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class CitySearchService {
  private readonly http = inject(HttpClient);

  async getCityList(searchKey: string): Promise<any> {
    const urlAdress = `${environment.apiBaseUrl}geo/1.0/direct?q=${searchKey}&limit=5&appid=${environment.openWeatherMapApiKey}`;
    const cityList = await firstValueFrom(this.http.get(urlAdress));
    return cityList;
  }
}
