import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@UntilDestroy()
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit {
  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;

  @Input() title: string = 'Каталог фильмов';

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe(query => {
        this.router.navigate([], {
          queryParams: { search: query || null },
          queryParamsHandling: 'merge',
        });
      });

    this.route.queryParamMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const search = params.get('search') ?? '';

        if (search !== this.searchControl.value) {
          this.searchControl.setValue(search, { emitEvent: false });

          if (search && this.searchInput) {
            this.searchInput.nativeElement.focus();
          }
        }
      });
  }

  clearSearch() {
    this.searchControl.setValue('');
  }
}
