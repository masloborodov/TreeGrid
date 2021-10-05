import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountryTree, IUsers } from '../interfaces/sours-data-interfase';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';

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

  public deleteById(id: string, country: string): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL).pipe(
      map((data) => {
        return data.map(elem => {
          if (elem.country !== country) {
            return elem;
          }
          return {
            ...elem,
            users: elem.users.filter((item) => item._id !== id)
          };
        });
      }),
      switchMap((body) => {
        return this.http.post<ICountryTree[]>(this.URL, body);
      })
    );
  }
}
