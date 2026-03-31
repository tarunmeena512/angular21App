import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class LandingPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Please fill in all fields correctly');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, password } = this.loginForm.value;
    const username = email.split('@')[0];
    console.log('Login attempt:', { email, password });

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.authService.login();
      this.successMessage.set('Login successful!');
      this.loginForm.reset();
      this.router.navigate(['/dashboard'], { queryParams: { username, email } });
    }, 2000);
  }

  onSignUp(): void {
    this.router.navigate(['/signup']);
  }
}
