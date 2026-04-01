import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models';
import { UsersStore } from '../../stores/dashboard.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsersStore],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone'];

  route = inject(ActivatedRoute);
  usersStore = inject(UsersStore);

  username = signal('');
  email = signal('');

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.username.set(params['username'] || 'User');
      this.email.set(params['email'] || '');
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  reloadUsers() {
    this.usersStore.reload();
  }
}
