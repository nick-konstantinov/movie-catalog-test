import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {catchError, Observable, retry, switchMap, throwError} from 'rxjs';
import { MovieResponse } from '../models/movie-response.model';
import {GenresService} from './genres.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private http = inject(HttpClient);
  private genresService = inject(GenresService);

  private apiUrl = environment.tmdbApiUrl;
  private apiKey = environment.tmdbApiKey;

  public getPopularMovies(page = 1): Observable<MovieResponse> {
    return this.fetchMovies(`${this.apiUrl}/movie/popular`, { page });
  }

  public searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.fetchMovies(`${this.apiUrl}/search/movie`, { query, page });
  }

  private fetchMovies(url: string, paramsObj: Record<string, any>): Observable<MovieResponse> {
    const params = { api_key: this.apiKey, language: environment.tmdbLanguage, ...paramsObj };

    return this.http.get<MovieResponse>(url, { params }).pipe(
      switchMap(res =>
        this.genresService.loadGenres().pipe(
          switchMap(() => {
            const resultsWithNames = res.results.map(movie => ({
              ...movie,
              genres: movie.genre_ids.map(id => this.genresService.getNameById(id)),
            }));
            return [ { ...res, results: resultsWithNames } ];
          })
        )
      ),
      retry(2),
      catchError(this.handleError)
    );
  }

  private handleError(error: unknown) {
    console.error('TMDB error', error);
    return throwError(() => new Error('Failed to load movies. Please try again.'));
  }
}
