import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  // Return the Observable directly
  getUsers() {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }
}
