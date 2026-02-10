import { Routes } from '@angular/router';
import {NotFound} from './pages/not-found/not-found';
import {Home} from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: '**',
    component: NotFound
  }
];
