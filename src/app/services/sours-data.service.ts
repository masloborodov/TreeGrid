import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountryTree } from '../interfaces/sours-data-interfase';

@Injectable({
  providedIn: 'root'
})
export class SoursDataService {

  constructor( private http: HttpClient) {

  }
  public getData(): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>('../../../assets/Users.json')
  }
}
