import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountryTree, IUser } from '../interfaces/sours-data-interfase';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly URL = environment.usersUrl;
  constructor(private http: HttpClient) {};

  public getAll(): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL)
  }

  public update(id: string, country: string, dto: Partial<IUser>): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL).pipe(
      map((data) => {
        return data.map(elem => {
          if (elem.country !== country) {
            return elem;
          }
          return {
            ...elem,
            users: elem.users.map((user) => {
              return user._id !== id
                ? user
                : { ...user, ...dto }
            })
          };
        });
      }),
      switchMap((body) => {
        return this.http.post<ICountryTree[]>(this.URL, body);
      })
    );
  }

  public delete(entitiesMap: Record<string, string[]>): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL).pipe(
      map((data) => {
        return data.map((item) => {
          if (!entitiesMap.hasOwnProperty(item.country)) {
            return item;
          }
          const idsToRemove = entitiesMap[item.country];
          return {
            ...item,
            users: item.users.filter((item) => !idsToRemove.includes(item._id))
          };
        });
      }),
      switchMap((body) => {
        return this.http.post<ICountryTree[]>(this.URL, body);
      })
    );
  }
}
