import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountryTree } from '../interfaces/sours-data-interfase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly URL = environment.usersUrl ;
  constructor( private http: HttpClient) {

  };
  public getAll(): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL)
  }

  public updateById(id: string, body: Record<string, any>): Observable<any>{
    return this.http.post(this.URL, { body })
  }

  public deleteById(id: string, body: Record<string, any>): Observable<any>{
    return this.http.delete(this.URL, { body })
  }
}
