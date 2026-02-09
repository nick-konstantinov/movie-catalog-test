import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import {Movie} from '../../models/movie.model';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCard {

  @Input({ required: true })
  movie!: Movie;

  imageBase = environment.tmdbImageUrl;

  get poster(): string {
    return this.movie.poster_path
      ? `${this.imageBase}${this.movie.poster_path}`
      : 'images/no-poster.webp';
  }

  get year(): string {
    return this.movie.release_date?.split('-')[0] ?? '—';
  }
}
