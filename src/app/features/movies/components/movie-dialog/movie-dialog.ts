import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { Movie } from '../../models/movie.model';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-movie-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    DecimalPipe
  ],
  templateUrl: './movie-dialog.html',
  styleUrls: ['./movie-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDialog {

  imageBase = environment.tmdbImageUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public movie: Movie & { genres?: string[] }
  ) {}

  get poster() {
    return this.movie.poster_path
      ? `${this.imageBase}${this.movie.poster_path}`
      : 'images/no-poster.webp';
  }

  get year() {
    return this.movie.release_date?.split('-')[0] ?? '—';
  }
}
