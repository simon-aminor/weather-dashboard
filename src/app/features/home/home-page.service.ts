import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  readonly http = inject(HttpClient);

  async getWeather(lat: number, lon: number) {
    const urlAdress = `${environment.apiBaseUrl}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.openWeatherMapApiKey}&units=metric`;
    const weatherCondition = await firstValueFrom(this.http.get(urlAdress));
    return weatherCondition;
  }
}
