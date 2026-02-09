import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import {MovieList} from './features/movies/components/movie-list/movie-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MovieList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Каталог фильмов');
}
