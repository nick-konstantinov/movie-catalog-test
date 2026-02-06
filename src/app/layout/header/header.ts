import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  @Input() title: string = 'Каталог фильмов';

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        untilDestroyed(this)
      )
      .subscribe(query => {
        console.log('Поиск:', query);
      });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchSubject.next(this.searchQuery);
  }
}
