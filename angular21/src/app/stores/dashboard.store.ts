import { inject } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../services/users.service';
import { User } from '../models';

export const UsersStore = signalStore(
  withMethods(() => {
    const userService = inject(UserService);

    const usersResource = rxResource({
      stream: () => userService.getUsers(),
    });

    return {
      usersResource() {
        return usersResource;
      },
      isLoading() {
        return usersResource.isLoading();
      },

      error() {
        return usersResource.error();
      },
      reload() {
        usersResource.reload();
      },
    };
  }),
);
