import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import {Movie} from '../../models/movie.model';
import {environment} from '../../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import {MovieDialog} from '../movie-dialog/movie-dialog';


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

  private dialog = inject(MatDialog);

  imageBase = environment.tmdbImageUrl;

  get poster(): string {
    return this.movie.poster_path
      ? `${this.imageBase}${this.movie.poster_path}`
      : 'images/no-poster.webp';
  }

  get year(): string {
    return this.movie.release_date?.split('-')[0] ?? '—';
  }

  openDialog() {
    this.dialog.open(MovieDialog, {
      data: this.movie,
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',

      enterAnimationDuration: '250ms',
      exitAnimationDuration: '200ms',

      autoFocus: false
    });
  }
}
