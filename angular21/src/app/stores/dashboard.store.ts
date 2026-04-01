import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../services/users.service';
import { User } from '../models';
import { debounceTime, distinctUntilChanged, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export const UsersStore = signalStore(
  { providedIn: 'root' },

  withState({
    searchQuery: '',
  }),

  withMethods((store) => {
    const userService = inject(UserService);

    const usersResource = rxResource({
      stream: () => userService.getUsers(),
    });

    const debouncedUpdate = rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          patchState(store, { searchQuery: query });
          return of(query);
        }),
      ),
    );
    return {
      usersResource: () => usersResource,

      isLoading: computed(() => usersResource.isLoading()),
      error: computed(() => usersResource.error()),
      reload() {
        usersResource.reload();
      },

      onSearch(query: string) {
        debouncedUpdate(query);
      },
    };
  }),

  withComputed((store) => ({
    filteredUsers: computed(() => {
      const resource = store.usersResource();
      const allUsers = resource.value() ?? [];
      const term = store.searchQuery().toLowerCase().trim();

      if (!term) return allUsers;

      return allUsers.filter(
        (user: User) =>
          user.name.toLowerCase().includes(term) ||
          user.phone.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term),
      );
    }),
  })),
);
