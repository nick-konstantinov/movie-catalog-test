import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, startWith, tap, scan, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, fromEvent, Observable } from 'rxjs';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { AsyncPipe } from '@angular/common';
import { MovieCard } from '../movie-card/movie-card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MovieCard,
    MatButtonModule
  ],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieList implements OnInit {

  private moviesService = inject(MoviesService);
  private route = inject(ActivatedRoute);

  loading = false;
  totalPages = 1;

  private search$ = this.route.queryParams.pipe(
    map(params => params['search'] ?? ''),
    distinctUntilChanged()
  );

  public page$ = new BehaviorSubject(1);

  showScrollTop$!: Observable<boolean>;

  movies$ = combineLatest([
    this.search$,
    this.page$
  ]).pipe(
    tap(() => this.loading = true),

    switchMap(([search, page]) =>
      search
        ? this.moviesService.searchMovies(search, page)
        : this.moviesService.getPopularMovies(page)
    ),

    tap(res => {
      this.totalPages = res.total_pages;
      this.loading = false;
    }),

    scan((all: Movie[], res) => {
      if (res.page === 1) {
        return res.results;
      }

      const map = new Map<number, Movie>();

      [...all, ...res.results].forEach(movie =>
        map.set(movie.id, movie)
      );

      return [...map.values()];

    }, []),

    shareReplay(1)
  );

  ngOnInit() {
    this.search$.subscribe(() => {
      this.page$.next(1);
      window.scrollTo({top: 0});
    });

    this.showScrollTop$ = fromEvent(window, 'scroll').pipe(
      map(() => window.scrollY > 400),
      startWith(false),
      distinctUntilChanged()
    );
  }

  loadNextPage() {
    if (!this.loading && this.page$.value < this.totalPages) {
      this.page$.next(this.page$.value + 1);
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
