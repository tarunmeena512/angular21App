import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models';
import { UsersStore } from '../../stores/dashboard.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

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
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsersStore],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private route = inject(ActivatedRoute);
  private usersStore = inject(UsersStore);

  private searchSubject = new Subject<string>();
  username = signal('');
  email = signal('');
  searchQuery = signal('');

  usersResource = this.usersStore.usersResource();
  isLoading = () => this.usersStore.isLoading();
  error = () => this.usersStore.error();
  reload = () => this.usersStore.reload();

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allUsers = this.usersResource.value() ?? [];

    return query ? allUsers.filter((u) => u.name.toLowerCase().includes(query)) : allUsers;
  });

  displayedColumns: string[] = ['id', 'name', 'email', 'phone'];

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.username.set(params['username'] || 'User');
      this.email.set(params['email'] || '');
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        this.searchQuery.set(value);
      });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  reloadUsers() {
    this.usersStore.reload();
  }
}
