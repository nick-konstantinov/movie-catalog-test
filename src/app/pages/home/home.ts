import { Component } from '@angular/core';
import {MovieList} from '../../features/movies/components/movie-list/movie-list';

@Component({
  selector: 'app-home',
  imports: [
    MovieList
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
