import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal to track if user is authenticated
  private authenticated = signal<boolean>(false);

  // Read-only version of the signal
  isLoggedIn = this.authenticated.asReadonly();

  login() {
    this.authenticated.set(true);
  }

  logout() {
    this.authenticated.set(false);
  }
}
