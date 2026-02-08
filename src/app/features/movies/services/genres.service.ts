import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private http = inject(HttpClient);

  private genreMap: Record<number, string> = {};

  loadGenres(): Observable<Record<number, string>> {
    if (Object.keys(this.genreMap).length) {
      return of(this.genreMap);
    }

    return this.http.get<{ genres: { id: number; name: string }[] }>(
      `${environment.tmdbApiUrl}/genre/movie/list`,
      { params: { api_key: environment.tmdbApiKey, language: environment.tmdbLanguage } }
    ).pipe(
      tap(res => {
        this.genreMap = res.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {});
      }),
      map(() => this.genreMap)
    );
  }

  getNameById(id: number): string {
    return this.genreMap[id] || '';
  }
}
