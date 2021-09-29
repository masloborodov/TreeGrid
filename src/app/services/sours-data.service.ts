import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SoursData } from '../interfaces/sours-data-interfase';

@Injectable({
  providedIn: 'root'
})
export class SoursDataService {

  constructor( private http: HttpClient) {

  }
  public getData(): Observable<SoursData[]> {
    return this.http.get<SoursData[]>('../../../assets/SoursData.json')
  }
}
