import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { MovieResponse } from '../models/movie-response.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private http = inject(HttpClient);

  private apiUrl = environment.tmdbApiUrl;
  private apiKey = environment.tmdbApiKey;

  getPopularMovies(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.apiUrl}/movie/popular`,
      {
        params: {
          api_key: this.apiKey,
          language: environment.tmdbLanguage,
          page
        }
      }
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  searchMovies(query: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.apiUrl}/search/movie`,
      {
        params: {
          api_key: this.apiKey,
          language: environment.tmdbLanguage,
          query
        }
      }
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  private handleError(error: unknown) {
    console.error('TMDB error', error);

    return throwError(() => new Error('Failed to load movies. Please try again.'));
  }
}
